import { ZFlowTask } from './z-flow-task';
import { GlobalDataPoolUpdateMode } from '../services/z-flow-store.service';
import { ZDictionnary, noOp } from '../helpers/z-tools';

export class ZFlowTaskMetadata {
  root = false;
  target?: boolean = false;
}

export abstract class ZFlowFlow extends ZFlowTask {
  tasks: ZFlowTask[] = [this];
  targets: ZFlowTask[] = [this];
  links: [ZFlowTask, ZFlowTask][] = [];

  updateMode: GlobalDataPoolUpdateMode = GlobalDataPoolUpdateMode.remplace;
  transformDataPoolFn: (dPool: Partial<ZDictionnary>) => Partial<ZDictionnary> = noOp;

  addTask(task: ZFlowTask, metadata: ZFlowTaskMetadata = new ZFlowTaskMetadata) {
    this.tasks.push(task);
    if (metadata.root) {
      this.addLink([this, task]);
    }
    if (metadata.target) {
      this.targets.push(task);
    }
    if ((task as ZFlowFlow).tasks && (task as ZFlowFlow).links) {
      (task as ZFlowFlow).links.forEach(link => this.addLink(link));
    }
  }

  addLink(link: [ZFlowTask, ZFlowTask]) {
    this.links.push(link);
  }
}
