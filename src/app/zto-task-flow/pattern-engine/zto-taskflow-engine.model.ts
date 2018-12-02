import { ZtoTaskflowFlow } from '../pattern-components/flow/zto-taskflow-flow.abstract';
import { ZtoGraph } from '../helpers/graph/zto-graph.model';
import { ZtoTaskflowAtom } from '../pattern-components/atom/zto-taskflow-atom.abstract';
import { ZtoNode } from '../helpers/graph/zto-node.model';
import { ZtoTaskflowFacade } from '../pattern-store/zto-taskflow.facade';
import { ZtoTaskflowFlowContext } from '../pattern-store/zto-taskflow.state';
import { ZtoDictionnary } from '../helpers/zto-dictionnary.model';
import { ZtoTaskflowFlowStatus } from '../pattern-components/flow/zto-taskflow-flow-status.enum';
import { take, map, switchMap, tap, mergeMap, reduce, scan, catchError } from 'rxjs/operators';
import { Observable, empty, concat, defer, of, zip, merge, throwError } from 'rxjs';
import { ZtoNodeMode } from '../helpers/graph/zto-node-mode.enum';
import { ZtoTaskflowAtomMode } from '../pattern-components/atom/zto-taskflow-atom-mode.enum';

export type ZtoTaskflowAtomGraph = ZtoGraph<ZtoTaskflowAtom>;
export type ZtoTaskflowAtomNode = ZtoNode<ZtoTaskflowAtom>;

export class ZtoTaskflowEngine {

  private flowGraph: ZtoTaskflowAtomGraph;
  private flowContext$: Observable<ZtoTaskflowFlowContext>;

  run$: Observable<ZtoDictionnary>;

  constructor(
    private facade: ZtoTaskflowFacade,
    private flow: ZtoTaskflowFlow,
    private inject: ZtoDictionnary,
    private provide: ZtoDictionnary = new ZtoDictionnary,
    private options: any = {},
  ) {
    const resolveINJECT = (item: ZtoTaskflowAtom) => (item.INJECT || []).forEach(symbol => item.injected[symbol] = this.inject[symbol]);
    const selectorFactory = (item: ZtoTaskflowAtom) =>
      (node: ZtoTaskflowAtomNode) => item.id === node.item.id;
    const modeFactory = (item: ZtoTaskflowAtom) => item.MODE === ZtoTaskflowAtomMode.all ? ZtoNodeMode.all : ZtoNodeMode.race;
    this.flow.atoms.forEach(resolveINJECT);
    this.flowGraph = new ZtoGraph(flow.atoms, flow.links, selectorFactory, modeFactory);
    console.log('New ZtoGraph created from flow: ', flow.TYPE, this.flowGraph);
    this.prepare();
    this.run$ = this.create();
  }

  private prepare() {
    const { id, status, TYPE } = this.flow;
    const arrayAsDictionnaryKeys = (dict: ZtoDictionnary, str: string) => ({ ...dict, [str]: null });
    const mapAtoms = (atom: ZtoTaskflowAtom) => ({
      INJECT_Aggregat: (atom.INJECT ? atom.INJECT : []).reduce(arrayAsDictionnaryKeys, new ZtoDictionnary),
      DEF_PROVIDE_Aggregat: (atom.DEF_PROVIDE ? atom.DEF_PROVIDE : new ZtoDictionnary),
      REQUIRES_Aggregat: (atom.REQUIRES ? atom.REQUIRES : []).reduce(arrayAsDictionnaryKeys, new ZtoDictionnary),
      PROVIDE_Aggregat: (atom.PROVIDE ? atom.PROVIDE : []).reduce(arrayAsDictionnaryKeys, new ZtoDictionnary),
      REBIND_Aggregat: (atom.REBIND ? atom.REBIND : new ZtoDictionnary),
      REVERT_REQUIRES_Aggregat: (atom.REVERT_REQUIRES ? atom.REVERT_REQUIRES : []).reduce(arrayAsDictionnaryKeys, new ZtoDictionnary),
      REVERT_PROVIDE_Aggregat: (atom.REVERT_PROVIDE ? atom.REVERT_PROVIDE : []).reduce(arrayAsDictionnaryKeys, new ZtoDictionnary),
      REVERT_REBIND_Aggregat: (atom.REVERT_REBIND ? atom.REVERT_REBIND : new ZtoDictionnary),
    });
    const aggregateEachToken = dicts => (acc, [token, innerDict]) => ({ ...acc, [token]: { ...innerDict, ...dicts[token] } });
    const aggregateEachTokenOfMapAtoms = (acc, mapAtom) => ({
      ...Object.entries(acc).reduce(aggregateEachToken(mapAtom), new ZtoDictionnary)
    });
    const aggregats = this.flow.atoms.map(mapAtoms).reduce(aggregateEachTokenOfMapAtoms);
    aggregats.PROVIDE_Aggregat = {
      ...aggregats.DEF_PROVIDE_Aggregat,
      ...aggregats.PROVIDE_Aggregat,
      ...this.provide
    };
    this.facade.add({ id, status, TYPE, ...aggregats, PROVIDE_Aggregat: { ...aggregats.PROVIDE_Aggregat, ...this.provide } });
    this.flowContext$ = this.facade.flowContextById(id);
  }

  private create(): Observable<ZtoDictionnary> {
    const onStart$ = defer(() => {
      return this.flowContext$.pipe(
        take(1),
        tap((flowContext: ZtoTaskflowFlowContext) => {
          this.facade.update({...flowContext, status: ZtoTaskflowFlowStatus.running});
        }),
        switchMap(() => empty())
      );
    });
    const onResolved$ = defer(() => {
      return this.flowContext$.pipe(
        take(1),
        tap((flowContext: ZtoTaskflowFlowContext) => {
          this.facade.update({ ...flowContext, status: ZtoTaskflowFlowStatus.resolved });
          this.facade.delete(flowContext);
        }),
        switchMap(() => empty())
      );
    });
    const onError = () => catchError((error: Error) => {
      return this.flowContext$.pipe(
        take(1),
        switchMap((flowContext: ZtoTaskflowFlowContext) => {
          this.facade.update({
            ...flowContext,
            status: ZtoTaskflowFlowStatus.errored,
            PROVIDE_Aggregat: {
              ...flowContext.PROVIDE_Aggregat,
              selfFailure: {
                name: error.name,
                message: error.message,
                stack: error.stack
              }
            }
          });
          this.facade.delete(flowContext);
          return throwError(error);
        })
      );
    });
    const PROVIDE_Aggregator = (PROVIDE_Aggregat: ZtoDictionnary, provide: ZtoDictionnary) => ({
      ...PROVIDE_Aggregat,
      ...provide
    });
    const flowExecution$ = this.traverse(this.flowGraph.tree).pipe(
      onError(),
      this.options.steps === true
        ? scan(PROVIDE_Aggregator)
        : reduce(PROVIDE_Aggregator)
    );
    return concat(onStart$, flowExecution$, onResolved$);
  }

  private traverse(atomNode: ZtoTaskflowAtomNode): Observable<ZtoDictionnary> {
    const traverseChild = (child: ZtoTaskflowAtomNode) => this.traverse(child);
    return defer(() => {
      if (atomNode.mode === ZtoNodeMode.race) {
        if (atomNode.visited > 0) {
          return empty();
        } else {
          atomNode.visited += 1;
        }
      } else if (atomNode.mode === ZtoNodeMode.all) {
        atomNode.visited += 1;
        if (atomNode.visited < atomNode.parents.length) {
          return empty();
        }
      }
      return concat(
        defer(() => this.runAtomNode(atomNode)),
        merge(...atomNode.childs.map(traverseChild)),
      );
    });
  }

  private runAtomNode(atomNode: ZtoTaskflowAtomNode): Observable<ZtoDictionnary> {
    const atom: ZtoTaskflowAtom = atomNode.item;
    const id = this.flow.id;
    const REQUIRES = atom.REQUIRES || [];
    const REBIND = atom.REBIND || [];
    const onlyNeededEntries = ([key]: [string, any]) => REQUIRES.includes(key)
      || REBIND.some((rebindObj: ZtoDictionnary) => Object.keys(rebindObj).includes(key));
    const rebind = (provide: ZtoDictionnary) => {
      REBIND.forEach((rebindObj: ZtoDictionnary) => provide[Object.values(rebindObj)[0]] = provide[Object.keys(rebindObj)[0]]);
      return provide;
    };
    const entryAsDictionnaryKeys = (dict: ZtoDictionnary, [key, value]: [string, any]) => ({ ...dict, [key]: value });
    const provide$: Observable<ZtoDictionnary> = this.facade.flowContextById(id).pipe(
      take(1),
      map((flowContext: ZtoTaskflowFlowContext) => Object.entries(flowContext.PROVIDE_Aggregat)
        .filter(onlyNeededEntries)
        .reduce(entryAsDictionnaryKeys, new ZtoDictionnary),
      ),
    );
    const selfExecutionProvide$ = provide$.pipe(
      switchMap((provide: ZtoDictionnary) => atom.execute ? atom.execute(rebind(provide)) : empty()),
      take(1),
      switchMap((provide: ZtoDictionnary) => this.flowContext$.pipe(
        take(1),
        map((flowContext: ZtoTaskflowFlowContext) => {
          this.facade.update({...flowContext, PROVIDE_Aggregat: {...flowContext.PROVIDE_Aggregat, ...provide}});
          return provide;
        })
      ))
    );
    return selfExecutionProvide$;
  }
}
