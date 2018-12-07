import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { LinkDescriptor } from '../header.service';

@Component({
  selector: 'app-header-simple-presenter',
  templateUrl: './header-simple-presenter.component.html',
  styleUrls: ['./header-simple-presenter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderSimplePresenterComponent implements OnInit {

  @Input() links: LinkDescriptor[];

  constructor() { }

  ngOnInit() {
  }

}
