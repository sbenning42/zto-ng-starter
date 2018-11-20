import { Component, OnInit } from '@angular/core';
import { StorageFacade } from '../../app-state/storage/store/facade';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(public storage: StorageFacade) { }

  ngOnInit() {
    this.storage.fetch();
  }

}
