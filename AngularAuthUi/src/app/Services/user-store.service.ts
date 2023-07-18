import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private fullName$ = new BehaviorSubject<string>('');
  private role$ = new BehaviorSubject<string>('');
  constructor() {}

  setRoleForStore(role:string){
    this.role$.next(role);
  }
  setFullNameForStore(FullName:string){
    this.fullName$.next(FullName);
  }
  getRoleFromStore(){
    return this.role$.asObservable();
  }
  getFullNameFromStore(){
    return this.fullName$.asObservable();
  }
}
