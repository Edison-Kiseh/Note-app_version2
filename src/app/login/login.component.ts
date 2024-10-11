import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

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

  constructor(private fb: FormBuilder){}

  ngOnInit(): void{
    this.form = this.fb.group({
      'email': [null, { validators: [Validators.required, Validators.email] }],
      // 'password': [null, { validators: [Validators.required, Validators.pattern(this.passwordPattern)] }]
      'password': [null, { validators: [Validators.required] }]
    })
  }

  submitForm(): void{
    console.log(this.form); 
  }

  get email(){
    return this.form.controls['email'];
  }

  get password(){
    return this.form.controls['password'];
  }
}
