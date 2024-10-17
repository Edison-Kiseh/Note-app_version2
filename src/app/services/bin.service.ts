import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bin } from '../models/bin.model';
import { from, Observable } from 'rxjs';
import { collection, deleteDoc, doc, DocumentReference, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BinService {

  constructor(private http: HttpClient, private db: Firestore){}

  emptyBin(id: string) {
    const binRef = doc(this.db, 'bin/' + id) as DocumentReference<Bin>;
    return from(deleteDoc(binRef));
  }
}
