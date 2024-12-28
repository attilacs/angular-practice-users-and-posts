import { Component } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [
    RouterLink,
    UserListComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
}
