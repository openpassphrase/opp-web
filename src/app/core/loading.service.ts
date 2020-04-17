import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly isLoadingSubj = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this.isLoadingSubj.asObservable();

  setLoading(isLoading: boolean) {
    this.isLoadingSubj.next(isLoading);
  }
}
