import { ZtoTaskflowAtom } from '../atom/zto-taskflow-atom.abstract';
import { ZtoTaskflowFlowStatus } from './zto-taskflow-flow-status.enum';

export abstract class ZtoTaskflowFlow extends ZtoTaskflowAtom {

  status = ZtoTaskflowFlowStatus.pending;
  atoms: Array<ZtoTaskflowAtom> = [this];
  links: Array<[ZtoTaskflowAtom, ZtoTaskflowAtom]> = [];

  add(atom_s: ZtoTaskflowAtom | Array<ZtoTaskflowAtom>, rootAtom: boolean = false) {
    this.atoms.push(...(Array.isArray(atom_s) ? atom_s : [atom_s]));
    if (rootAtom) {
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
