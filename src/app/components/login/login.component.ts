import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { User, userLogin } from '../../interface/login';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isInvalid: boolean = false;
  loginForm!: FormGroup;
  demouser!: User[] | undefined;
  selectedDemoUser: User | undefined;
  constructor(
    private fb: FormBuilder,
    private login: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.login.demoUserSubject.subscribe((user) => {
      this.demouser = user;
    });
    this.loginForm = this.fb.group({
      email: [
        this.selectedDemoUser?.email ?? '',
        [Validators.required, Validators.email],
      ],
      password: [
        this.selectedDemoUser?.password ?? '',
        [Validators.required, Validators.minLength(4)],
      ],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isInvalid = false;
      this.login.loginUser(this.loginForm.value).subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          let nextUrl = this.login.getRedirectUrl();
          if (nextUrl) {
            this.router.navigate([nextUrl]);
          } else {
            this.router.navigateByUrl('admin/home');
          }
        } else {
          this.isInvalid = true;
        }
      });
    } else {
      this.isInvalid = true;
    }
  }

  updateDefaultUser(event: DropdownChangeEvent) {
    let { originalEvent, value } = event;
    let { email, password } = value;
    if (!email || !password) {
      this.loginForm.patchValue({ email: '', password: '' });
      return;
    }
    console.log(originalEvent, email, password);
    this.loginForm.patchValue({ email, password });
  }
}
