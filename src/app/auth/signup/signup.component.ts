import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  form!: FormGroup;
  validators!: Validators;
  passwordPattern: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  userNamePattern: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){}

  ngOnInit(): void{
    this.form = this.fb.group({
      'firstName': [null, { validators: [Validators.required, Validators.pattern(this.userNamePattern)] }],
      'lastName': [null, { validators: [Validators.required, Validators.pattern(this.userNamePattern)] }],
      'email': [null, { validators: [Validators.required, Validators.email] }],
      'password': [null, { validators: [Validators.required, Validators.pattern(this.passwordPattern)] }],
    })
  }

  onSignUp(): void {
    const email = this.form.value.email;
    const password = this.form.value.password;

    this.authService.signup(email, password)
      .then((res) => {
        if (res === 'success') {
          // this.router.navigate(['login']);
          alert('success');
        } else {
          alert(res);
        }
    });
  }

  get firstName(){
    return this.form.controls['firstName'];
  }

  get lastName(){
    return this.form.controls['lastName'];
  }

  get email(){
    return this.form.controls['email'];
  }

  get password(){
    return this.form.controls['password'];
  }
}
