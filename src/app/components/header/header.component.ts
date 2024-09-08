import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isLogin: boolean = false;

  isMenuOpen: boolean = false;
  constructor(public loginService: LoginService,private router:Router) {}
  ngOnInit() {
    this.loginService.isloggedInSubject.subscribe((status) => {
      this.isLogin = status;
    });
  }

  handleLogin(){
    if(this.isLogin){
      this.loginService.logout();
    }
    this.router.navigateByUrl('admin/login');
  }

  handleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }
}
