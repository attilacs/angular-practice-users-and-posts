import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Post, PostsEditDto } from '../../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly url = 'http://localhost:3000/posts';
  private readonly http = inject(HttpClient);

  getPosts(userId?: string | null): Observable<Post[]> {
    const url = userId
      ? `${this.url}?userId=${userId}`
      : this.url;
    return this.http.get<Post[]>(url);
  }

  getPostsById(id: string): Observable<Post | null> {
    const url = `${this.url}?id=${id}`;
    return this.http.get<Post[]>(url).pipe(
      map((posts) => {
        if (posts.length) {
          return posts[0];
        }
        return null;
      }),
    );
  }

  addPost(post: PostsEditDto): Observable<Post> {
    return this.http.post<Post>(this.url, post);
  }

  updatePost(id: string, post: PostsEditDto): Observable<Post> {
    const url = `${this.url}/${id}`;
    return this.http.patch<Post>(url, post);
  }

  deletePost(id: string): Observable<void> {
    const url = `${this.url}/${id}`;
    return this.http.delete<void>(url);
  }
}
