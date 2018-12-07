import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class LinkDescriptor {
  constructor(
    public path: string,
    public name: string
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private links: LinkDescriptor[] = [
    new LinkDescriptor('/home', 'HOME'),
  ];

  private links$$: BehaviorSubject<LinkDescriptor[]> = new BehaviorSubject([]);

  get links$(): Observable<LinkDescriptor[]> {
    return this.links$$.asObservable();
  }

  constructor() {
    this.next();
  }

  private next() {
    this.links$$.next(this.links);
  }

  update(links: LinkDescriptor[]) {
    this.links = links;
    this.next();
  }
}
