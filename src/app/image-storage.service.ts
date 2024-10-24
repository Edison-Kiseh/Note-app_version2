import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { doc, Firestore } from '@angular/fire/firestore';
import { Notebook } from './models/notebooks.model';
import { BookDBServiceService } from './services/book-dbservice.service';
import { BinService } from './services/bin.service';
import { Bin } from './models/bin.model';
import { NotesDBServiceService } from './services/notes-dbservice.service';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  latestImageUrl: Subject<string> = new Subject<string>();
  notebooks: Notebook[] = [];
  bin: Bin = new Bin;
  deletedStuff: Bin[] = [];

  constructor(private noteService: NotesDBServiceService, private storage: Storage, private db: Firestore, private notebooksService: BookDBServiceService, private binService: BinService) {}

  async downloadImg(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const url = await getDownloadURL(storageRef); 
    return url; 
  }

  async getNotebookImage(filePath: string, itemsToUpdate: any[]): Promise<void> {
    try {
      const url = await this.downloadImg(filePath); 
      console.log(url);
      this.updateImage(url, itemsToUpdate);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  }

  private updateImage(url: string, itemsToUpdate: any[]): void {
    if (url) {
      for (let stuff of itemsToUpdate) {
        if (stuff.type === 'notebook') {
          stuff.img = url;
        } else if (stuff.type === 'note') {
          stuff.img = url;
        }
      }
    } else {
      console.log("No image URL available.");
    }
  }

  async uploadImage(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    const task = uploadBytesResumable(storageRef, file);
    await task;
    const url = await getDownloadURL(storageRef);
    this.updateNotebookImages(url);
    this.latestImageUrl.next(url); 
    return url;
  }

  updateNotebookImages(url: string) {
    // Fetching all notebooks
    this.notebooksService.getNotebooks().subscribe({
      next: (books: Notebook[]) => {
        this.notebooks = books; 

        // Use map to create an array of promises
        const updatePromises = this.notebooks.map((notebook) => {
          notebook.img = url;
          // this.setupBinItem(notebook);

          this.notebooksService.updateNoteBook(notebook); 
        });
  
        try {
          // Waiting for all updates to complete
          Promise.all(updatePromises);
          console.log('All notebooks updated successfully with the new image URL:', url);
        } catch (error) {
          console.error('Error updating notebooks:', error); 
        }
      },
      error: (error) => console.log('Error fetching notebooks: ', error)
    });

    //
    this.updateDeletedStuff(url, "notebook");
  }

  updateDeletedStuff(url: string, type: string) {
    this.noteService.getDeletedNotes().subscribe({
      next: (stuff: Bin[]) => {
        this.deletedStuff = stuff;

        // Use map to create an array of promises
        const updatePromises = this.deletedStuff.map((del) => {
          del.img = url;

          if(del.type === "notebook"){
            this.binService.updateStuff(del);
          }
        });

        try {
          // Waiting for all updates to complete
          Promise.all(updatePromises);
          console.log('All notebooks in the bin updated successfully with the new image URL:', url);
        } catch (error) {
          console.error('Error updating bin items:', error); 
        }
      },
      error: (error) => console.log('Error fetching bin items: ', error)
    })
  }

  setupBinItem(notebook: Notebook) {
    //setting up for updating in the bin
    this.bin.id = notebook.id;
    this.bin.img = notebook.img;
    this.bin.name = notebook.name;
    this.bin.text = '';
    this.bin.time = notebook.time;
    this.bin.type = 'notebook';
    
  }
}
