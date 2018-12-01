import { ZtoNode } from './zto-node.model';

export class ZtoGraph<T = any> {

  tree: ZtoNode<T>;

  constructor(items: Array<T>, links: Array<[T, T]>, selectorFactory: (item: T) => (innerNode: ZtoNode<T>) => boolean) {
    const nodes = items.map(item => new ZtoNode(item));
    const selectNodeFactory = (item: T) => nodes.find(selectorFactory(item));
    const mapItems: (link: [T, T]) => [ZtoNode<T>, ZtoNode<T>] = ([provider, dependant]: [T, T]) => [
      selectNodeFactory(provider),
      selectNodeFactory(dependant)
    ];
    const resolveNodeLink = ([provider, dependant]: [ZtoNode<T>, ZtoNode<T>]) => provider.add(dependant);
    const resolveLink = (link: [T, T]) => resolveNodeLink(mapItems(link));
    links.forEach(resolveLink);
    this.tree = nodes[0];
  }
}
