import { ZFlowFlow } from '../abstracts/z-flow-flow';
import { ZFlowTask } from '../abstracts/z-flow-task';

export class ZFlowTaskNode {
  childs: ZFlowTaskNode[] = [];
  constructor(public task: ZFlowTask) { }
  add(node: ZFlowTaskNode) {
    this.childs.push(node);
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
  }
  traverseApply(func: (task: ZFlowTask) => boolean) {
    this.recTraverseApply(this.tree, func);
  }
  recTraverseApply(node: ZFlowTaskNode, func: (task: ZFlowTask) => boolean) {
    if (!func(node.task)) {
      return;
    }
    node.childs.forEach((child: ZFlowTaskNode) => this.recTraverseApply(child, func));
  }
}
