import { Component, effect, inject, input, OnInit } from '@angular/core';
import { PostService } from '../../services/post/post.service';
import { EMPTY, Observable } from 'rxjs';
import { Post } from '../../interfaces/post';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-post-list',
  imports: [
    AsyncPipe,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  userId = input.required<string | null>();
  postService = inject(PostService);
  posts$: Observable<Post[]> = EMPTY;

  constructor() {
    effect(() => {
      this.fetchPosts();
    })
  }

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    this.posts$ = this.postService.getPosts(this.userId());
  }
}
