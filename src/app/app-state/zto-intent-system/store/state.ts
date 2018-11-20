import { ZtoIntent } from "./models";

export interface ZtoIntentSystemState {
    processing: {[id: string]: ZtoIntent};
    resolved: {[id: string]: ZtoIntent};
}
export const initialZtoIntentSystemState: ZtoIntentSystemState = {
    processing: {},
    resolved: {}
};
