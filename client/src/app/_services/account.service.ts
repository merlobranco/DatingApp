import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  baseUrl = 'https://localhost:5001/api/';

  // Creating an observable for storing our user
  // A replaysubject is an buffer and everytime a subscriber subscribes to this observable
  // it will emit the last value inside it, or however values we want to emit inside it
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
      )
    }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        // It is possible returning the user for later logging
        return user;
      })
    )
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }
     
  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}