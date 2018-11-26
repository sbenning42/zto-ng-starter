import { ZtoBaseCommandWithoutSrc, ZtoAsyncCorrelation } from '../../zto-action-system/zas.models';

export enum ToasActionType {
  open = '[Toast] Open',
  close = '[Toast] Close',
}

export class ToastOpen extends ZtoBaseCommandWithoutSrc<{message: string}> {
  type = ToasActionType.open;
  correlations = {
    async: new ZtoAsyncCorrelation(ToasActionType.open),
  };
  constructor(payload: { message: string }) {
    super(payload);
  }
}
export class ToastClose extends ZtoBaseCommandWithoutSrc<void> {
  type = ToasActionType.close;
  correlations = {
    async: new ZtoAsyncCorrelation(ToasActionType.open),
  };
}
