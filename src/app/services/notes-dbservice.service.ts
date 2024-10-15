import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note.model';
import { Bin } from '../models/bin.model';
import { from, Observable } from 'rxjs';
import { Notebook } from '../models/notebooks.model';
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotesDBServiceService {

  constructor(private http: HttpClient, private db: Firestore){}

  // getNotes(NBId: string): Observable<Note[]> {
  //   if(NBId == ""){
  //     const url = "http://localhost:3000/notes";
  //     return this.http.get<Note[]>(url);
  //   }
  //   else{
  //     const url = "http://localhost:3000/notes?notebookId=" + NBId;
  //     return this.http.get<Note[]>(url);
  //   }
  // }

  getNotes(NBId: string): Observable<Note[]> {
    if(NBId == ""){
      return collectionData<Note>(
        collection(this.db, 'notes') as CollectionReference<Note>,
        {idField: 'id'}
      )
    }
    else{
      return collectionData<Note>(
        collection(this.db, 'notes/' + NBId) as CollectionReference<Note>,
        {idField: 'id',}
      )
    }
  }

  getNotesBySearch(pattern: string): Observable<Note[]>{
    const url = "http://localhost:3000/notes?title=" + pattern;
    return this.http.get<Note[]>(url);
  }

  addNote(note: Note): Observable<Note>{
    const url = "http://localhost:3000/notes";
    return this.http.post<Note>(url, note);
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

  updateNoteName(note: Note): Observable<Note>{
    const url = `http://localhost:3000/notes/` + note.id;
    return this.http.patch<Note>(url, note);
  }

  saveNoteTitle(noteId: string, updatedNote: Note): Observable<Note> {
    const url = `http://localhost:3000/notes/${noteId}`;
    return this.http.patch<Note>(url, updatedNote);
  }
  
  saveNoteText(noteId: string, updatedNote: Note): Observable<Note> {
    const url = `http://localhost:3000/notes/${noteId}`;
    return this.http.put<Note>(url, updatedNote);
  }

  moveNoteToRecycleBin(note: Bin): Observable<Bin> {
    const url = "http://localhost:3000/deletedNotes";
    return this.http.post<Bin>(url, note);
  }

  deleteNote(noteId: string): Observable<any>{
    const url = `http://localhost:3000/notes/${noteId}`;
    return this.http.delete(url);
  }

  deleteDeletedNotes(noteId: string): Observable<any>{
    const url = "http://localhost:3000/deletedNotes/" + noteId;
    return this.http.delete(url);
  }

  getDeletedNotes(): Observable<Bin[]>{
    const url = "http://localhost:3000/deletedNotes"
    return this.http.get<Bin[]>(url);
  }

  getNotesByNotebookId(notebookId: string): Observable<Note[]> {
    const url = "http://localhost:3000/notes?notebookId=" + notebookId;
    return this.http.get<Note[]>(url);
  }

}
