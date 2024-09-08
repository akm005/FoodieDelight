// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class LoginService {
//   isloggedIn:boolean = false
//   isloggedInSubject = new BehaviorSubject<boolean>(false);
//   private redirectUrl: string | null = null;

//   constructor(private http:HttpClient) {}

//   loginUser(data:any){
//     this.login();

//   }

//   setRedirectUrl(url: string) {
//     this.redirectUrl = url;
//   }

//   getRedirectUrl(): string | null {
//     const url = this.redirectUrl;
//     this.redirectUrl = null; // Reset after getting
//     return url;
//   }

//   login() {
//     this.isloggedIn = true
//     this.isloggedInSubject.next(true);
//   }

//   logout() {
//     this.isloggedIn = false
//     this.isloggedInSubject.next(false);
//   }
//   isAuthenticated():Boolean{
//     return this.isloggedIn
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Password } from 'primeng/password';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, userLogin } from '../interface/login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private isloggedIn = false;
  isloggedInSubject = new BehaviorSubject<boolean>(false);
  private redirectUrl: string | null = null;
  public currentUser: User |null = null;
  demoUser!: User[];
  demoUserSubject = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {}

  loginUser(credentials: userLogin): Observable<boolean> {
    return this.http.get<any[]>('assets/data/userData.json').pipe(
      map((users) => {
        const user = users.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );
        if (user) {
          this.currentUser = user;
          this.login();
          return true;
        } else {
          this.logout();
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error fetching user data', error);
        this.logout();
        return of(false);
      })
    );
  }

  private login() {
    this.isloggedIn = true;
    this.isloggedInSubject.next(true);
  }

  logout() {
    this.isloggedIn = false;
    this.isloggedInSubject.next(false);
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return this.isloggedIn;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    const url = this.redirectUrl;
    this.redirectUrl = null;
    return url;
  }

  loadAllDemoUser() {
    this.http.get<User[]>('assets/data/userData.json').subscribe((data) => {
      this.demoUser = data;
      return this.demoUserSubject.next(data);
    });
  }
}
