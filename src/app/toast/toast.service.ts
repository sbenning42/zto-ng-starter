import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Observable, empty } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  currentRef: MatSnackBarRef<SimpleSnackBar>;
  isOpen: boolean;

  constructor(public snack: MatSnackBar) { }

  open(message: string): Observable<any> {
    this.currentRef = this.snack.open(message, '', {
      duration: 4000,
    });
    return this.currentRef.afterOpened().pipe(tap(() => this.isOpen = true));
  }
  close(): Observable<any> {
    if (this.currentRef && this.open) {
      this.currentRef.dismiss();
      return this.currentRef.afterDismissed().pipe(tap(() => this.isOpen = false));
    }
    return empty();
  }

}
