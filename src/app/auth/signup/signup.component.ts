import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../../services/user.service';

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
  userExists: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService){}

  ngOnInit(): void{
    this.form = this.fb.group({
      'firstName': [null, { validators: [Validators.required] }],
      'lastName': [null, { validators: [Validators.required] }],
      'email': [null, { validators: [Validators.required, Validators.email] }],
      'password': [null, { validators: [Validators.required, Validators.pattern(this.passwordPattern)] }],
    })
  }

  onSignUp(): void {
    const email = this.form.value.email;
    const password = this.form.value.password;
    const firstName = this.form.value.firstName;
    const lastName = this.form.value.lastName;

    this.authService.signup(email, password)
      .then((res) => {
        if (res === 'success') {
          this.userService.addUserToDb(firstName, lastName);
          //logging the user in directly after signing up
          this.authService.login(email, password);
          // this.router.navigate(['/']);
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
