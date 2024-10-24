import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Bin } from '../models/bin.model';
import { NotesDBServiceService } from '../services/notes-dbservice.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BinService } from '../services/bin.service';
import { BookDBServiceService } from '../services/book-dbservice.service';
import { Note } from '../models/note.model';
import { Notebook } from '../models/notebooks.model';
import { FormsModule } from '@angular/forms';
import { NotebookTitlePipe } from '../pipes/notebook-title.pipe';
import { Timestamp } from '@angular/fire/firestore';
import { ImageStorageService } from '../image-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, NotebookTitlePipe],
  templateUrl: './bin.component.html',
  styleUrl: './bin.component.css',
  providers:[NotesDBServiceService, BinService, BookDBServiceService, Note]
})
export class BinComponent {
  showListFlag = false;
  listPositionX: number = 0;
  listPositionY: number = 0;
  selectedNoteBookIndex: number = -1
  deletedStuff: Bin[] = []
  tempDeletedStuff: Bin[] = []
  note: Note = new Note()
  binSearchContent: string = ""
  notebookImageUrl: string = ''; 
  noteImageUrl: string = '';

  constructor(private notesService: NotesDBServiceService, private notebooksService: BookDBServiceService, private http: HttpClient, private binService: BinService, private imageService: ImageStorageService){}

  ngOnInit(): void {
    this.getDeletedNotes();
    // this.getNotebookImage('/images/background-image.jpg', '/images/notebook.jpg');
  }

  getDeletedNotes(): void{
    this.notesService.getDeletedNotes().subscribe({
      next: (notes: Bin[]) => {
        this.deletedStuff = notes;
        this.tempDeletedStuff = [...this.deletedStuff];
      },
      error: (error) => console.log('DB notes fetch error: ', error)
    })
  }

  emptyBin(): void{
    this.deletedStuff.forEach((bin) => {
      this.binService.emptyBin(bin.id).subscribe({
        next: () => {
          console.log('Item deleted')
          this.getDeletedNotes()
        },
        error: (error) => console.log('Error emptying bin ', error)
      })
    });

    console.log('Bin emptied')
  }

  showList(event: MouseEvent) {
    event.preventDefault(); // Prevent the default right-click context menu
    this.showListFlag = true;
    this.listPositionX = event.clientX;
    this.listPositionY = event.clientY;
  }
  
  deleteNoteOrNotebook(index: number): void{
    const noteId = this.deletedStuff[index].id.toString()
    const noteType = this.deletedStuff[index].type

    if(noteType == 'note'){
      this.notesService.deleteDeletedNotes(noteId).subscribe({
        next: () => {
          console.log('Note deleted')
          this.getDeletedNotes()
        },
        error: (error) => console.log('Error deleting note ', error)
      })
    }else{
      this.notebooksService.deleteDeletedNoteBook(noteId).subscribe({
        next: () => {
          console.log('Notebook deleted')
          this.getDeletedNotes()
        },
        error: (error) => console.log('Error deleting notebook ', error)
      })
    }
  }

  restoreNoteOrNotebook(index: number): void{
    const noteId = this.deletedStuff[index].id.toString()
    const noteType = this.deletedStuff[index].type

    if(noteType == 'note'){
      const restoreNote = new Note()

      restoreNote.id = noteId
      restoreNote.img = 'src/assets/images/allnotes.png'
      restoreNote.text = this.deletedStuff[index].text
      restoreNote.time = Timestamp.now()
      restoreNote.name= this.deletedStuff[index].name

      this.notesService.addNote(restoreNote).subscribe({
        next: () => {
          console.log('Note restored')
          this.deleteNoteOrNotebook(index)
          this.getDeletedNotes()
        },
        error: (error) => console.log('Error restoring note ', error)
      })
    }else{
      const restoreNotebook = new Notebook()

      restoreNotebook.id = noteId
      restoreNotebook.img = '../../assets/images/notebook.jpg'
      restoreNotebook.name = this.deletedStuff[index].name

      this.notebooksService.addNewNoteBook(restoreNotebook).subscribe({
        next: () => {
          console.log('Notebook restored')
          this.deleteNoteOrNotebook(index)
          this.getDeletedNotes()
        },
        error: (error) => console.log('Error restoring notebook ', error)
      })
    }
  }

  setSelectedNoteBookIndex(index: number): void{
    this.selectedNoteBookIndex = index
  }

  hideList() {
    this.showListFlag = false;
  }

  //search function to filter notes based on user search
  filterBy() {
    const searchTerm = this.binSearchContent.toLowerCase().trim(); // Get the search term from the input element  
    
    if (searchTerm) {
      // Filter notes based on the search term
      this.deletedStuff = this.tempDeletedStuff.filter(n => n.name.toLowerCase().includes(searchTerm));
    } else {
      // If the search term is empty, restore the original list of notes
      this.deletedStuff = [...this.tempDeletedStuff];    }
  }

  //sorting alphabetically
  sortNotesAlphabetically(): void {
    this.deletedStuff.sort((a, b) => {
        const titleA = a.name.toUpperCase(); // Convert titles to uppercase
        const titleB = b.name.toUpperCase();
        if (titleA < titleB) {
            return -1; // Title A comes before title B
        }
        if (titleA > titleB) {
            return 1; // Title A comes after title B
        }
        return 0; // Titles are equal
    });
  }

  //sorting by date
  sortNotesByDateDeleted(): void {
    this.deletedStuff.sort((a, b) => {
        const dateA = a.time.toDate();
        const dateB = a.time.toDate();

        if (dateA < dateB) {
            return 1; 
        }
        if (dateA > dateB) {
            return -1; 
        }
        return 0;
    });
  }

  handleSortChange(event: Event) {
    const sortOption = (event.target as HTMLSelectElement).value;
    console.log('Selected option:', sortOption);
    
    if(sortOption == "alphabetically"){
      this.sortNotesAlphabetically()
    }
    else if(sortOption == "dateDeleted"){
      this.sortNotesByDateDeleted()
    }
    else if(sortOption == "none"){
      this.getDeletedNotes()
    }
  }

  //fetching the images of either the note or the notebook
  async getNotebookImage(notebookFilePath: string, noteFilePath: string) {
    await this.imageService.downloadImg(notebookFilePath).then((url: string) => {
      console.log("Notebook Image URL:", url);
      this.notebookImageUrl = url;
    }).catch((error) => {
      console.error("Error downloading notebook image:", error);
    });
  
    await this.imageService.downloadImg(noteFilePath).then((url: string) => {
      console.log("Note Image URL:", url);
      this.noteImageUrl = url; 
    }).catch((error) => {
      console.error("Error downloading note image:", error);
    });
  
    this.updateNotebookImage();
  }
  
  updateNotebookImage(): void {
    if (this.notebookImageUrl || this.noteImageUrl) {
      for (let stuff of this.deletedStuff) {
        if (stuff.type === 'notebook') {
          stuff.img = this.notebookImageUrl;
          console.log("Updated Notebook Image:", stuff.img);
        } else if (stuff.type === 'note') {
          stuff.img = this.noteImageUrl; 
          console.log("Updated Note Image:", stuff.img);
        }
      }
    } else {
      console.log("No image URLs available.");
    }
  }
}
