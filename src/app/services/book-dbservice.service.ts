import { Injectable } from '@angular/core';
import { Notebook } from '../models/notebooks.model';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { collection, collectionData, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class BookDBServiceService {

  constructor(private http: HttpClient, private db: Firestore){}
  
  //adding a new notebook
  addNewNoteBook(notebook: Notebook) {
    const newID = doc(collection(this.db, 'id')).id;
    const ref = doc(this.db, 'notebooks/' + newID);

    //doing this because setDoc requires a javascript object
    const notebookData = {
      id: notebook.id,
      img: notebook.img, 
      name: notebook.name,
      noteCount: notebook.notecount,
      time: notebook.time
    };

    return from(setDoc(ref, notebookData));
  }

  // updateNoteBook(notebook: Notebook): Observable<Notebook>{
  //   const url = "http://localhost:3000/notebooks/" + notebook.id;
  //   return this.http.patch<Notebook>(url, notebook);
  // }

  updateNoteBook(notebook: Notebook) {
    const bookRef = doc(this.db, 'notebooks/' + notebook.id) as DocumentReference<Notebook>;
    
    //doing this because setDoc requires a javascript object
    const notebookData = {
      id: notebook.id,
      img: notebook.img, 
      name: notebook.name,
      noteCount: notebook.notecount? notebook.notecount: 0,
      time: notebook.time
    };
    
    return from(updateDoc(bookRef, notebookData));
  }

  deleteNoteBook(id: string) {
    const bookRef = doc(this.db, 'notebooks/' + id) as DocumentReference<Notebook>;
    return from(deleteDoc(bookRef));
  }

  // deleteNoteBook(id: string): Observable<String>{
  //   const url = "http://localhost:3000/notebooks/" + id;
  //   return this.http.delete<String>(url);
  // }

  deleteDeletedNoteBook(id: string): Observable<String>{
    const url = "http://localhost:3000/deletedNotes/" + id;
    return this.http.delete<String>(url);
  }

  getSingleNotebook(id: string): Observable<Notebook>{
    const url = "http://localhost:3000/notebooks/" + id;
    return this.http.get<Notebook>(url);
  }

  getNotebooks(): Observable<Notebook[]> {
    return collectionData<Notebook>(
      collection(this.db, 'notebooks') as CollectionReference<Notebook>,
      {idField: 'id'}
    )
  }
}

// getNotebooks(): Observable<Notebook[]>{
//   const url = "http://localhost:3000/notebooks";
//   return this.http.get<Notebook[]>(url);
// }
