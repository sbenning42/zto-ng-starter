import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ZasFacade } from './zas.facade';
import { zasInterpretAsyncCorrelation, zasInterpretSequenceCorrelation, zasInterpretFlowCorrelation } from './zas.functions';

@Injectable()
export class ZasEffects {
  constructor(public actions: Actions, public zas: ZasFacade) { }
  @Effect() async = this.actions.pipe(zasInterpretAsyncCorrelation(this.zas.correlationResolvers));
  @Effect() sequence = this.actions.pipe(zasInterpretSequenceCorrelation(this.zas.correlationResolvers));
  @Effect() flow = this.actions.pipe(zasInterpretFlowCorrelation(this.zas.correlationResolvers));
}
