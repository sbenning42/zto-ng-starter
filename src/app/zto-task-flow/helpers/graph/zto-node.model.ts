import { ZtoNodeMode } from './zto-node-mode.enum';

export class ZtoNode<T = any> {

  parents: Array<ZtoNode<T>> = [];
  childs: Array<ZtoNode<T>> = [];

  visited = 0;

  constructor(public item?: T, public mode: ZtoNodeMode = ZtoNodeMode.race) {
  }

  add(child_s: ZtoNode<T> | Array<ZtoNode<T>>) {
    const linkChild = (child: ZtoNode<T>) => {
      child.parents.push(this);
      this.childs.push(child);
    };
    Array.isArray(child_s)
      ? child_s.forEach(linkChild)
      : linkChild(child_s);
  }

}
