import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: Firestore, private authService: AuthService) { }

  addUserToDb(firstName: string, lastName: string) {
    const userID = this.authService.getUserID();
    const ref = doc(this.db, 'users/' + userID);

    const userData = {
      firstName: firstName,
      lastName: lastName
    };

    return from(setDoc(ref, userData));
  }

  fetchUsers(): Observable<User[]> {
    return collectionData<User>(
      collection(this.db, 'users') as CollectionReference<User>,
      {idField: 'userID'}
    )
  }
}
