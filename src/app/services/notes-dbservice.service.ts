import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note.model';
import { Bin } from '../models/bin.model';
import { from, Observable } from 'rxjs';
import { Notebook } from '../models/notebooks.model';
import { collection, collectionData, CollectionReference, doc, DocumentData, Firestore, setDoc, where, query, DocumentReference, deleteDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotesDBServiceService {

  constructor(private http: HttpClient, private db: Firestore){}

  getNotes(NBId: string): Observable<Note[]> {
    if(!NBId){
      return collectionData<Note>(
        collection(this.db, 'notes/') as CollectionReference<Note>,
        {idField: 'id'}
      )
    }
    else{
      return collectionData<Note>(
        query<Note, DocumentData>(
          collection(this.db, 'notes/') as CollectionReference<Note>,
          where('notebookId', '==', NBId)
        ),
        { idField: 'id' } 
      )
    }
  }

  getNotesBySearch(pattern: string): Observable<Note[]>{
    const url = "http://localhost:3000/notes?title=" + pattern;
    return this.http.get<Note[]>(url);
  }

  // addNote(note: Note): Observable<Note>{
  //   const url = "http://localhost:3000/notes";
  //   return this.http.post<Note>(url, note);
  // }

  //adding a new notebook
  addNote(note: Note) {
    const newID = doc(collection(this.db, 'id')).id;
    const ref = doc(this.db, 'notes/' + newID);

    //doing this because setDoc requires a javascript object
    const noteData = {
      id: note.id,
      img: note.img, 
      name: note.name,
      notebookId: note.notebookId,
      time: note.time, 
      text: note.text
    };

    return from(setDoc(ref, noteData));
  }

  //adding a new notebook
  // addNote(note: Note) {
  //   const newID = doc(collection(this.db, 'id')).id;
  //   const ref = doc(this.db, 'notes/' + newID);

  //   //doing this because setDoc requires a javascript object
  //   const noteData = {
  //     id: note.id,
  //     img: note.img, 
  //     notebookId: note.notebookId,
  //     text: note.text,
  //     time: note.time, 
  //     title: note.title
  //   };

  //   return from(setDoc(ref, noteData));
  // }

  // updateNoteName(note: Note): Observable<Note>{
  //   const url = `http://localhost:3000/notes/` + note.id;
  //   return this.http.patch<Note>(url, note);
  // }

  // saveNoteTitle(noteId: string, updatedNote: Note): Observable<Note> {
  //   const noteRef = doc(this.db, 'notes/' + updatedNote.id) as DocumentReference<Note>;
    
  //   //doing this because setDoc requires a javascript object
  //   const noteData = {
  //     id: updatedNote.id,
  //     img: updatedNote.img, 
  //     name: updatedNote.name,
  //     notebookId: updatedNote.notebookId,
  //     time: updatedNote.time, 
  //     text: updatedNote.text
  //   };
    
  //   return from(updateDoc(noteRef, noteData));
  // }
  
  updateNote(note: Note) {
    const noteRef = doc(this.db, 'notes/' + note.id) as DocumentReference<Note>;
    
    //doing this because setDoc requires a javascript object
    const noteData = {
      id: note.id,
      img: note.img, 
      name: note.name,
      notebookId: note.notebookId,
      time: note.time, 
      text: note.text
    };
    
    return from(updateDoc(noteRef, noteData));
  }

  moveNoteToRecycleBin(stuff: Bin) {
    const newID = doc(collection(this.db, 'id')).id;
    const ref = doc(this.db, 'bin/' + newID);

    //doing this because setDoc requires a javascript object
    const notebookData = {
      id: stuff.id,
      img: stuff.img, 
      name: stuff.name,
      text: stuff.text,
      type: stuff.type,
      time: stuff.time
    };

    return from(setDoc(ref, notebookData));
  }

  deleteNote(noteId: string) {
    const noteRef = doc(this.db, 'notes/' + noteId) as DocumentReference<Note>;
    return from(deleteDoc(noteRef));
  }

  deleteDeletedNotes(noteId: string): Observable<any>{
    const noteRef = doc(this.db, 'bin/' + noteId) as DocumentReference<Note>;
    return from(deleteDoc(noteRef));
  }

  getDeletedNotes(): Observable<Bin[]> {
    return collectionData<Bin>(
      collection(this.db, 'bin/') as CollectionReference<Bin>,
      {idField: 'id'}
    )
  }

  getNotesByNotebookId(notebookId: string): Observable<Note[]> {
    return collectionData<Note>(
      query<Note, DocumentData>(
        collection(this.db, '/notes') as CollectionReference<Note>,
        where('notebookId', '==', notebookId)
      ),
      { idField: 'id' } 
    );
  }
}
