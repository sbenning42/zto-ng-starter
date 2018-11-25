import { Component } from '@angular/core';
import { StorageService } from './app-state/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zto-intent-starter';
  constructor(
    public storage: StorageService
  ) {
  }
}
