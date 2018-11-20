import { Component, OnInit } from '@angular/core';
import { HeaderService, LinkDescriptor } from '../header.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header-container',
  templateUrl: './header-container.component.html',
  styleUrls: ['./header-container.component.css']
})
export class HeaderContainerComponent implements OnInit {

  links$: Observable<LinkDescriptor[]>;

  constructor(public header: HeaderService) {
    this.links$ = this.header.links$;
  }

  ngOnInit() {
  }

}
