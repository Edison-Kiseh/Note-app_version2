import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Auth } from '@angular/fire/auth';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ImageStorageService } from '../image-storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users: User[] = [];
  file: File | null = null;
  imageUrl: string = "";
  imageUploaded: boolean = false;
  constructor(private userService: UserService, private authService: AuthService, private auth: Auth, private router: Router, private imageStorage: ImageStorageService){}

  ngOnInit(){
    // this.fetchUsers
  }

  // fetchUsers(){
  //   this.userService.fetchUsers().subscribe({
  //     next: (users: User[]) => {
  //       this.users = users
  //     },
  //     error: (error) => {
  //       console.error('Error fetching users', error);
  //     }
  //   });
  // }
  // deleteUser() {
  //   this.authService.deleteUser()
  //   .next((result) => {
  //     console.log(result);
  //   })
  //   .catch((error) => {
  //     console.log('Error:', error);
  //   });
  // }
  
  // onDeleteAccount(userIndex: number): void {
  //   const user = this.users[userIndex];
  //   if(user){
  //     const userId = user.userID;
      
  //     this.userService.deleteUserFromDb(userId).subscribe({
  //       next: () => {
  //         console.log("User deleted successfully");
  //         return this.authService.deleteUser();
  //       }, 
  //       error: (error) => {
  //         console.log('Error deleting the user ', error);
  //       }
  //     });
  //   } else {
  //     console.error('No user is currently signed in.');
  //   }
  // }

  selectImg(event: Event): void{
    const target = event.target as HTMLInputElement;

    if(target.files && target.files[0]){
      this.file = target.files[0];
      this.imageUploaded = false;
      console.log(this.file.name);
    }
  }
  
  async setFile(): Promise<void> {
    if (this.file) {
      const path = 'images/' + this.file.name; 
      try {
        this.imageUrl = await this.imageStorage.uploadImage(path, this.file); 
        this.imageUploaded = true;
        console.log("Uploaded Image URL:", this.imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error); 
      }
    } else {
      console.log("No file selected."); 
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.file && !this.imageUploaded) {
      return confirm('You have selected an image but not uploaded it. Do you want to leave without uploading?');
    }
    return true;
  }
}
