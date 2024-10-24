import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bin } from '../models/bin.model';
import { from, Observable } from 'rxjs';
import { collection, deleteDoc, doc, DocumentReference, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BinService {

  constructor(private http: HttpClient, private db: Firestore){}

  emptyBin(id: string) {
    const binRef = doc(this.db, 'bin/' + id) as DocumentReference<Bin>;
    return from(deleteDoc(binRef));
  }

  updateStuff(stuff: Bin) {
    // if(stuff.type === 'notebook') {
      const bookRef = doc(this.db, 'bin/' + stuff.id) as DocumentReference<Bin>;
    
      //doing this because setDoc requires a javascript object
      const notebookData = {
        id: stuff.id,
        img: stuff.img, 
        name: stuff.name,
        type: stuff.type,
        text: stuff.text,
        time: stuff.time
      };
      
      console.log('updated bin items')
      return from(updateDoc(bookRef, notebookData));
    // }
    // else{
    //   return "WOw"
    // }
  }
}
