import { ZAtom } from './z-atom';
import { ZLink } from './z-link';
import { ZStep } from './z-step';
import { Observable, of, BehaviorSubject, concat, empty } from 'rxjs';
import { ZNode } from './z-node';
import { ZStepStatus } from './z-step-status';

export class ZGraph {
  tree: ZNode<ZAtom>;
  constructor(
    readonly nodeArray: Array<ZAtom>,
    readonly linkArray: Array<ZLink>,
  ) {
    const nodes = nodeArray.map(item => new ZNode(item));
    this.tree = nodes[0];
    linkArray.forEach(link => {
      const provider = nodes.find(node => node.item.name === link.providerName);
      const dependant = nodes.find(node => node.item.name === link.dependantName);
      if (!provider || !dependant) {
        throw new Error('ZGraph: linkArray contains unknown reference(s). (aka: not in nodeArray)');
      }
      provider.add(dependant);
    });
    console.log('Created a new flow tree: ', this.tree);
  }
}
