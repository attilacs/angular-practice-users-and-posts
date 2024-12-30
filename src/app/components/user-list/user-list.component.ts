import { Component, inject, output } from '@angular/core';
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
  userSelected = output<string>();

  constructor() {
    this.getUsers();
  }

  getUsers() {
    this.users$ = this.service.getUsers();
  }

  selectUser(userId: string) {
    this.userSelected.emit(userId);
  }
}
