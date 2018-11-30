import { ZRetry } from './z-retry';
import { ZAtom } from './z-atom';
import { ZDictionary } from './z-helpers';
import { ZLink } from './z-link';

export abstract class ZFlow<I = any, R = any, P = any, RR = any, RP = any> extends ZAtom<I, R, P, RR, RP> {
  abstract name: string;
  nodes: Array<ZAtom> = new Array;
  links: Array<ZLink> = new Array;
  constructor(
    public retry?: ZRetry,
    public inject?: ZDictionary<I>,
    public requires?: ZDictionary<R>,
    public provide?: ZDictionary<P>,
    public rebind?: ZDictionary<string>,
    public revertRequires?: ZDictionary<RR>,
    public revertProvide?: ZDictionary<RP>,
    public revertRebind?: ZDictionary<string>,
  ) {
    super(inject, requires, provide, rebind, revertRequires, revertProvide, revertRebind);
  }
  add(node_s: ZAtom | Array<ZAtom>) {
    if (Array.isArray(node_s)) {
      this.nodes.push(...node_s);
    } else {
      this.nodes.push(node_s);
    }
  }
}

/*
export abstract class ZLinearFlow<I = any, R = any, P = any, RR = any, RP = any> extends  ZFlow<I, R, P, RR, RP> {
  readonly isLinearFlow = true;
}
export abstract class ZUnorderedFlow<I = any, R = any, P = any, RR = any, RP = any> extends  ZFlow<I, R, P, RR, RP> {
  readonly isUnorderedFlow = true;
}
*/
export abstract class ZGraphFlow<I = any, R = any, P = any, RR = any, RP = any> extends  ZFlow<I, R, P, RR, RP> {
  readonly isGraphFlow = true;
  link(link_s: ZLink | Array<ZLink>) {
    if (Array.isArray(link_s)) {
      this.links.push(...link_s);
    } else {
      this.links.push(link_s);
    }
  }
}
/*
export abstract class ZTargetedFlow<I = any, R = any, P = any, RR = any, RP = any> extends  ZGraphFlow {
  readonly isGraphFlow = true;
  readonly isTargetedFlow = true;
  target: string;
}
*/
