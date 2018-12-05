import { ZFlowTask } from './z-flow-task';

export class ZFlowTaskMetadata {
  root = false;
  target?: boolean = false;
}

export abstract class ZFlowFlow extends ZFlowTask {
  tasks: ZFlowTask[] = [this];
  targets: ZFlowTask[] = [this];
  links: [ZFlowTask, ZFlowTask][] = [];

  addTask(task: ZFlowTask, metadata: ZFlowTaskMetadata = new ZFlowTaskMetadata) {
    this.tasks.push(task);
    if (metadata.root) {
      this.addLink([this, task]);
    }
    if (metadata.target) {
      this.targets.push(task);
    }
  }

  addLink(link: [ZFlowTask, ZFlowTask]) {
    this.links.push(link);
  }
}
