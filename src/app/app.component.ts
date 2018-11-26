import { Component } from '@angular/core';
import { ToastFacade } from './app-state/toast/store/toast.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zto-intent-starter';
  constructor(
    public toast: ToastFacade
  ) {
  }
}
