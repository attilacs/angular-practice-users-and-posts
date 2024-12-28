import { Component, inject } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { User } from '../../interfaces/user';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-list',
  imports: [
    AsyncPipe,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  private service = inject(UserService);
  users$: Observable<User[] | null> = EMPTY;

  constructor() {
    this.getUsers();
  }

  private getUsers() {
    this.users$ = this.service.getUsers();
  }
}
