import { Component, inject, input, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostListComponent } from '../post-list/post-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  imports: [
    AsyncPipe,
    PostListComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  userService = inject(UserService);
  users$: Observable<User[]>;
  userId = input<string>('');
  router = inject(Router);
  selectedUserId = new FormControl('', Validators.required);

  constructor() {
    this.users$ = this.userService.getUsers();
  }

  ngOnInit(): void {
    this.selectedUserId.setValue(this.userId());
  }

  addPost() {
    this.router.navigate(["posts", "new"]);
  }

}
