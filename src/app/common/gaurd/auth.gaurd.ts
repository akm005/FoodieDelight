import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';
// import { AuthService } from './auth.service'; // Replace with the actual path

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private login: LoginService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log(this.activatedRoute.snapshot.url)
    const isAuthenticated = this.login.isAuthenticated();

    if (isAuthenticated) {
      return true;
    } else {
     
      this.login.setRedirectUrl(state.url); 
      this.router.navigate(['/login']);
      return false;
    }
  }
}
