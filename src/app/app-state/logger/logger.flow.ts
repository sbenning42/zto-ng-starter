import { ZTask } from '../../z-flow/models/z-task';
import { ZDictionary } from '../../z-flow/models/z-helpers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class LogTask extends ZTask {
    name = '[Log Task] Log';
    inject = { loggerService: null };
    requires = { logTaskMessages: null };
    provide = { logTaskMessagesLogged: null };
    execute(requires: ZDictionary): Observable<ZDictionary> {
      const logger = this.inject.loggerService;
      const logTaskMessages = requires.logTaskMessages;
      return logger.log(...logTaskMessages).pipe(
        map(() => ({logTaskMessagesLogged: logTaskMessages}))
      );
    }
  }
  export class ErrorTask extends ZTask {
    name = '[Log Task] Error';
    inject = { loggerService: null };
    requires = { errorTaskMessages: null };
    provide = { errorTaskMessagesLogged: null };
    execute(requires: ZDictionary): Observable<ZDictionary> {
      const logger = this.inject.loggerService;
      const errorTaskMessages = requires.errorTaskMessages;
      return logger.error(...errorTaskMessages).pipe(
        map(() => ({errorTaskMessagesLogged: errorTaskMessages}))
      );
    }
  }
