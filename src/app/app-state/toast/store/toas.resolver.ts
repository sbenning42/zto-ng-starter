import { Injectable } from '@angular/core';
import { ZasFacade } from '../../zto-action-system/zas.facade';
import { ToastService } from '../toast.service';
import { ToasActionType } from './toas.actions';

@Injectable()
export class ToastResolver {
  open = this.zas.baseAsyncResolver(`${ToasActionType.open}@async`, mapAsync => this.toast.openSnackBar(mapAsync.action.payload.message));
  close = this.zas.baseAsyncResolver(`${ToasActionType.close}@async`, () => this.toast.closeSnackBar());
  constructor(public zas: ZasFacade, public toast: ToastService) {}
}
