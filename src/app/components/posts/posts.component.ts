import { Component, inject, input, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostListComponent } from '../post-list/post-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  imports: [
    PostListComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  userService = inject(UserService);
  users: User[] = [];
  userId = input<string>('');
  router = inject(Router);
  selectedUserId = new FormControl('', Validators.required);
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    this.selectedUserId.setValue(this.userId());
    this.fetchUsers();
  }

  fetchUsers() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
    });
  }

  addPost() {
    this.router.navigate(["posts", "new"]);
  }

}
