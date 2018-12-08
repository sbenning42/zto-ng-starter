import { ZFlowFlow } from '../abstracts/z-flow-flow';
import { ZFlowTask } from '../abstracts/z-flow-task';
import { ZFlowAtomAsyncMode } from '../abstracts/z-flow-atom';

export enum ZFlowTaskNodeTraverseMode {
  firstParent = '[Zto TaskNode Traverse Mode] First Parent',
  lastParent = '[Zto TaskNode Traverse Mode] Last Parent'
}

function asyncModeToTraverseMode(asyncMode: ZFlowAtomAsyncMode): ZFlowTaskNodeTraverseMode {
  switch (asyncMode) {
    case ZFlowAtomAsyncMode.all:
      return ZFlowTaskNodeTraverseMode.lastParent;
    case ZFlowAtomAsyncMode.race:
    default:
      return ZFlowTaskNodeTraverseMode.firstParent;
  }
}

export class ZFlowTaskNode {
  parents: ZFlowTaskNode[] = [];
  childs: ZFlowTaskNode[] = [];
  traverseMode: ZFlowTaskNodeTraverseMode = ZFlowTaskNodeTraverseMode.firstParent;
  visit = 0;
  constructor(public task: ZFlowTask) {
    this.traverseMode = asyncModeToTraverseMode(task.asyncMode);
  }
  add(node: ZFlowTaskNode) {
    this.childs.push(node);
    node.parents.push(this);
  }
  reset() {
    this.visit = 0;
  }
}

export class ZFlowTaskGraph {
  tree: ZFlowTaskNode;
  constructor(flow: ZFlowFlow) {
    const nodes = flow.tasks.map((task: ZFlowTask) => new ZFlowTaskNode(task));
    const selectNode = (task: ZFlowTask) => (node: ZFlowTaskNode) => task.id === node.task.id;
    const findTask = (task: ZFlowTask) => nodes.find(selectNode(task));
    const mapLink = ([provider, dependent]: [ZFlowTask, ZFlowTask]) => [
      findTask(provider),
      findTask(dependent)
    ];
    const resolveLink = ([provider, dependent]: [ZFlowTaskNode, ZFlowTaskNode]) => provider.add(dependent);
    flow.links.map(mapLink).forEach(resolveLink);
    this.tree = nodes[0];
    // console.log(this.tree);
  }
}
