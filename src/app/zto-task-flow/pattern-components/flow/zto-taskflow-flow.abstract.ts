import { ZtoTaskflowAtom } from '../atom/zto-taskflow-atom.abstract';
import { ZtoTaskflowFlowStatus } from './zto-taskflow-flow-status.enum';
import { ZtoDictionnary } from '../../helpers/zto-dictionnary.model';

export abstract class ZtoTaskflowFlow extends ZtoTaskflowAtom {

  status = ZtoTaskflowFlowStatus.pending;
  atoms: Array<ZtoTaskflowAtom> = [this];
  target: ZtoTaskflowAtom = this;
  links: Array<[ZtoTaskflowAtom, ZtoTaskflowAtom]> = [];

  addSubFlow(flow: ZtoTaskflowFlow, options: ZtoDictionnary = { rootAtom: false, target: false }) {
    const start = flow.atoms[0];
    const rest = flow.atoms.slice(1);
    this.add(start, { rootAtom: options.rootAtom });
    this.add(rest);
    if (options.target) {
      this.target = flow.target;
    }
    this.link(flow.links);
  }
  add(atom_s: ZtoTaskflowAtom | Array<ZtoTaskflowAtom>, options: ZtoDictionnary = { rootAtom: false, target: false }) {
    if (options.target) {
      this.target = atom_s as ZtoTaskflowAtom;
    }
    this.atoms.push(...(Array.isArray(atom_s) ? atom_s : [atom_s]));
    if (options.rootAtom) {
      // A flow may be add in another flow as a subflow, that's why a flow should
      // act as a parallele splitter for all of it's first level childs
      this.link(
        Array.isArray(atom_s)
          ? atom_s.map(atom => ([this, atom] as [ZtoTaskflowAtom, ZtoTaskflowAtom]))
          : ([[this, atom_s]] as Array<[ZtoTaskflowAtom, ZtoTaskflowAtom]>)
      );
    }
  }

  link(links: Array<[ZtoTaskflowAtom, ZtoTaskflowAtom]>) {
    this.links.push(...links);
  }

}
