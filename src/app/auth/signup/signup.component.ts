import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../../services/user.service';
import { deleteDoc, doc, DocumentReference, Firestore } from '@angular/fire/firestore';
import { User } from '../../models/user.model';
import { from, Observable } from 'rxjs';

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
  passwordPattern: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  userNamePattern: RegExp = /^[A-Za-z\d]{4,}$/;
  validEmailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  userExists: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService, private db: Firestore){}

  ngOnInit(): void{
    this.form = this.fb.group({
      'firstName': [null, { validators: [Validators.required, this.validName.bind(this)] }],
      'lastName': [null, { validators: [Validators.required, this.validName.bind(this)] }],
      'email': [null, { validators: [Validators.required, Validators.email, this.validEmail.bind(this)],
        asyncValidators: [this.emailExists.bind(this)], 
        updateOn: 'change'
      }], 
                        
      'password': [null, { validators: [Validators.required, this.validPassword.bind(this)] }], 
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

    this.form.statusChanges.subscribe(
      (state) => console.log(state)
    );
  }

  emailExists(control: FormControl): Promise<any> | Observable<any> {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const existingEmails = '';

        if (control.value === 'son@gmail.com') {
          console.log("Email has been taken");
          resolve({ 'emailTaken': true });
          this.userExists = true;
        } else {
          resolve(null);
        }
      }, 1500);
    });
  }

  validEmail(control: FormControl): {[s:string]: boolean} | null {
    if(!control.value){
      return null;
    }
    if(!this.validEmailPattern.test(control.value)){
      return {'invalidFormat': true};
    }
    return null;
  }

  validName(control: FormControl): {[s:string]: boolean} | null {
    if(!control.value){
      return null;
    }
    if(!this.userNamePattern.test(control.value)){
      return {'invalidFormat': true};
    }
    return null;
  }

  validPassword(control: FormControl): {[s:string]: boolean} | null {
    if(!control.value){
      return null;
    }
    if(!this.passwordPattern.test(control.value)){
      return {'invalidFormat': true};
    }
    return null;
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
