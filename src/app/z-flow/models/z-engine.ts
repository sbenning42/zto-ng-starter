import { ZFlow } from './z-flow';
import { ZStep } from './z-step';
import { Observable, empty, of, concat, defer } from 'rxjs';
import { tap, switchMap, first, map, startWith } from 'rxjs/operators';
import { ZGraph } from './z-graph';
import { ZNode } from './z-node';
import { ZAtom } from './z-atom';
import { ZStepStatus } from './z-step-status';
import { ZDictionary } from './z-helpers';

export class ZEngine {
  private provided: ZDictionary = new ZDictionary;
  private graph: ZGraph;
  execution$: Observable<ZStep>;
  constructor(public services: ZDictionary, flow: ZFlow) {
    if (flow.provide) {
      this.provided = {...this.provided, ...flow.provide};
    }
    this.graph = new ZGraph(flow.nodes, flow.links);
    this.runnerFactory();
    // @TODO: analyse the flow to save it's provide array in Redux-storage
  }
  private runnerFactory() {
    this.execution$ = concat(
      this.recTraverser(this.graph.tree).pipe(
        startWith({status: ZStepStatus.start}),
      ),
      of({status: ZStepStatus.stop})
    );
  }
  private recTraverser(node: ZNode<ZAtom>): Observable<ZStep> {
    const selfExecution$ = this.traverseNode(node).pipe(
      // @TODO: Should track those emission by persisting them in the Redux-Store
      // @TODO: That tracking may enable the provide-require link between dependant tasks
    );
    const childsExecutionOrStop$ = node.childs.length > 0
      ? node.childs.map(child => this.recTraverser(child))
      : [empty()];
    return concat(selfExecution$, ...childsExecutionOrStop$).pipe<ZStep>(
      // @TODO implement retry/reverse logic
    );
  }
  private traverseNode(node: ZNode<ZAtom>): Observable<ZStep> {
    const mustInject = ([name]: [string, any]) => Object.keys(node.item.inject || {}).includes(name);
    const mustProvide = ([name]: [string, any]) => Object.keys(node.item.requires || {}).includes(name);
    const pushOnProvided = ([name, value]: [string, any]) => {
      if (!this.provided[name]) {
        this.provided[name] = [];
      }
      this.provided[name].push(value);
    };
    const asZDictionary = (dict: ZDictionary, [name, item]: [string, any]) => ({ ...dict, [name]: item });
    const asZDictionaryFromStack = (dict: ZDictionary, [name, item]: [string, any]) => ({ ...dict, [name]: item.shift() });
    node.item.inject = Object.entries(this.services)
      .filter(mustInject)
      .reduce(asZDictionary, new ZDictionary);
    const args$ = defer(() => of(Object.entries(this.provided)
      .filter(mustProvide)
      .reduce(asZDictionaryFromStack, new ZDictionary)).pipe(first())); // @TODO: get args from store by resolving requires field of the task
    return node.item.execute
      ? args$.pipe(
        tap(requires => node.item.preExecute ? node.item.preExecute() : undefined),
        switchMap(requires => node.item.execute(requires).pipe(
          tap((result: ZDictionary) => node.item.postExecute ? node.item.postExecute() : undefined),
        // A Task's execute Observable is not allowed to emit more than once...
          // It may be a problem, but right now I feel like the original TaskFlow pattern enforce this.
          // I think that if a service or another Observable source make sense by emiting multiple values,
          // it may either:
          //    - act as a ZTask / ZFlow to dispatch
          //    - been aggregated in a ZTask execute method
          first(),
          tap((result: ZDictionary) => Object.entries(result).forEach(pushOnProvided)),
          map((result: ZDictionary) => ({status: ZStepStatus.step, data: new ZDictionary(result)})),
          // @TODO implement retry/reverse logic
        ))
      )
      : empty();
  }
}
