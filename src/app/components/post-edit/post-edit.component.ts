import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user/user.service';
import { PostService } from '../../services/post/post.service';

enum SubscriptionKey {
  Users = 'users',
}

@Component({
  selector: 'app-post-edit',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css',
})
export class PostEditComponent implements OnInit, OnDestroy {
  router = inject(Router);
  postService = inject(PostService);
  userService = inject(UserService);
  users: User[] = [];
  form: FormGroup<PostForm>;
  subscriptions = new Map<SubscriptionKey, Subscription>();

  constructor() {
    this.form = new FormGroup({
      userId: new FormControl({ value: '', disabled: true }, Validators.required),
      title: new FormControl('', Validators.required),
      body: new FormControl(''),
    });
  }

  ngOnInit(): void {
    const usersSubscription = this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.form.controls.userId.enable();
      },
    });
    this.subscriptions.set(SubscriptionKey.Users, usersSubscription);
  }

  ngOnDestroy(): void {
    this.unsubScribeAll();
  }

  }

  savePost() {
    const userId = this.form.value.userId;
    const title = this.form.value.title;
    const body = this.form.value.body ?? '';
    if (!userId || !title) {
      return;
    }
    this.postService.addPost({ userId, title, body }).subscribe({
      next: () => {
        this.router.navigate(["posts"]);
      }
    })
  }

  private unsubScribe(key: SubscriptionKey): void {
    const subscription = this.subscriptions.get(key);
    if (!subscription) {
      return;
    }
    subscription.unsubscribe();
    this.subscriptions.delete(key);
  }

  private unsubScribeAll(): void {
    for (const subscription of this.subscriptions.values()) {
      subscription.unsubscribe();
    }
    this.subscriptions.clear();
  }
}
