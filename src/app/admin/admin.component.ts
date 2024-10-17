import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users: User[] = [];
  constructor(private userService: UserService){}

  ngOnInit(){
    this.userService.fetchUsers().subscribe({
      next: (users: User[]) => {
        this.users = users
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });
  }
}
