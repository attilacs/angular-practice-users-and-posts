import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../interfaces/post';

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
}
