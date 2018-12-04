import { ZFlowFlow } from "../../z-flow-redux/abstracts/z-flow-flow";
import { LoggerTaskLog, LoggerTaskError } from "./logger.tasks";

export enum LoggerFlowType {
    log = '[Logger Flow Type] Log',
    error = '[Logger Flow Type] Error',
}

export class LoggerFlowLog extends ZFlowFlow {
    type = LoggerFlowType.log;
    constructor() {
        super();
        const logTask = new LoggerTaskLog;
        this.addTask(logTask, { root: true, target: true });
    }
}

export class LoggerFlowError extends ZFlowFlow {
    type = LoggerFlowType.error;
    constructor() {
        super();
        const errorTask = new LoggerTaskError;
        this.addTask(errorTask, { root: true, target: true });
    }
}