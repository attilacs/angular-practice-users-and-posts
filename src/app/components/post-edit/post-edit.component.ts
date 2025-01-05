import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user/user.service';
import { PostService } from '../../services/post/post.service';
import { Post } from '../../interfaces/post';
import { of, Subscription, switchMap } from 'rxjs';

interface PostForm {
  userId: FormControl<string | null>;
  title: FormControl<string | null>;
  body: FormControl<string | null>;
}

enum SubscriptionKey {
  Delete = 'delete',
  Init = 'init',
  Save = 'save',
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
  route = inject(ActivatedRoute);
  router = inject(Router);
  postService = inject(PostService);
  userService = inject(UserService);
  users: User[] = [];
  form: FormGroup<PostForm>;
  subscriptions = new Map<SubscriptionKey, Subscription>();
  postId: string | null = null;

  constructor() {
    this.form = new FormGroup({
      userId: new FormControl({ value: '', disabled: true }, Validators.required),
      title: new FormControl('', Validators.required),
      body: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.unsubScribe(SubscriptionKey.Init);
    const initSubscription = this.route.paramMap.pipe(
      switchMap((param) => {
        this.postId = param.get('id');
        if (this.postId) {
          return this.postService.getPostsById(this.postId);
        }
        return of(null);
      }),
    ).subscribe({
      next: (post) => {
        if (post) {
          this.initPost(post);
        }
      },
    });
    this.subscriptions.set(SubscriptionKey.Init, initSubscription);

    const usersSubscription = this.userService.getUsers()
      .subscribe({
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

  private initPost(initial?: Post) {
    this.form = new FormGroup({
      userId: new FormControl({ value: initial?.userId ?? '', disabled: !this.users.length }, Validators.required),
      title: new FormControl(initial?.title ?? '', Validators.required),
      body: new FormControl(initial?.body ?? ''),
    });
  }

  savePost() {
    const userId = this.form.value.userId;
    const title = this.form.value.title;
    const body = this.form.value.body ?? '';
    if (!userId || !title) {
      return;
    }
    const apiCall = this.postId
      ? this.postService.updatePost(this.postId, { userId, title, body })
      : this.postService.addPost({ userId, title, body });
    this.unsubScribe(SubscriptionKey.Save);
    const saveSubscription = apiCall.subscribe({
      next: () => {
        this.router.navigate(["posts"]);
      }
    });
    this.subscriptions.set(SubscriptionKey.Save, saveSubscription);
  }

  deletePost() {
    this.unsubScribe(SubscriptionKey.Delete);
    if (!this.postId) {
      return;
    }
    if (!confirm("Do you really want to delete the post?")) {
      return;
    }
    const subscription = this.postService.deletePost(this.postId).subscribe({
      next: () => {
        this.router.navigate(['posts']);
      },
    });
    this.subscriptions.set(SubscriptionKey.Delete, subscription);
  }

  cancel() {
    this.router.navigate(["posts"]);
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
