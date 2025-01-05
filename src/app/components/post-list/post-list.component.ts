import { Component, effect, inject, input, OnInit } from '@angular/core';
import { PostService } from '../../services/post/post.service';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { Post, PostWithUser } from '../../interfaces/post';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-post-list',
  imports: [
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  userId = input.required<string | null>();
  users = input.required<User[]>();
  postService = inject(PostService);
  posts: PostWithUser[] = [];
  posts$: Observable<Post[]> = EMPTY;
  router = inject(Router);
  private subscription: Subscription | null = null;

  constructor() {
    effect(() => {
      this.fetchPosts();
    })
  }

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.postService.getPosts(this.userId()).subscribe({
      next: (posts) => {
        this.posts = this.mapUsers(posts, this.users());
      },
    });
  }

  private mapUsers(posts: Post[], users: User[]): PostWithUser[] {
    return posts.map(post => {
      return {
        ...post,
        user: users.find(user => user.id === post.userId) ?? null,
      }
    })
  }

  postSelected(id: string) {
    this.router.navigate(["posts", "edit", id]);
  }
}
