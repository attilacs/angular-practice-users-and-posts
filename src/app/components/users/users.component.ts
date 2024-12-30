import { Component, inject, ViewChild } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { Router, RouterLink } from '@angular/router';

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
  private router = inject(Router);
  @ViewChild('userList') userList: UserListComponent | undefined;

  userSelected(id: string) {
    this.router.navigate(["users/edit", id]);
  }

  refresh() {
    this.userList?.getUsers();
  }
}
