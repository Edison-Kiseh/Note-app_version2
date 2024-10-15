import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Route, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form!: FormGroup;
  validators!: Validators;
  //this password pattern should only be used for the signup form instead!
  passwordPattern: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  invalidLogin: boolean = false;
  token: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){}

  ngOnInit(): void{
    this.invalidLogin = false;
    
    this.form = this.fb.group({
      'email': [null, { validators: [Validators.required, Validators.email] }],
      // 'password': [null, { validators: [Validators.required, Validators.pattern(this.passwordPattern)] }]
      'password': [null, { validators: [Validators.required] }]
    })
  }

  onLogin(): void{
    const email = this.form.value.email;
    const password = this.form.value.password;

    this.authService.login(email, password).then((response) => {
      if (!response) {
        this.invalidLogin = true;
        console.log('Login failed')
      } else {
        this.invalidLogin = false;
        this.router.navigate(['/']);
      }
    }); 
  }

  get email(){
    return this.form.controls['email'];
  }

  get password(){
    return this.form.controls['password'];
  }
}
