// communication.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private resultSubject: string = '';

  setResult(result: string) {
    this.resultSubject = result;
  }

  getResult(): string {
    return this.resultSubject;
  }
}
