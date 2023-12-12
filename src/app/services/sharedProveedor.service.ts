import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private identifierIdSubject = new BehaviorSubject<string>('');
  identifierId$: Observable<string> = this.identifierIdSubject.asObservable();

  setIdentifierId(identifierId: string): void {
    this.identifierIdSubject.next(identifierId);
  }
}