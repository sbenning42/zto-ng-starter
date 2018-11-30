export class ZNode<T = any> {
  childs: Array<ZNode<T>> = new Array;
  constructor(
    public item: T
  ) { }
  add(node_s: ZNode<T> | Array<ZNode<T>>) {
    if (Array.isArray(node_s)) {
      this.childs.push(...node_s);
    } else {
      this.childs.push(node_s);
    }
  }
}
