import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserAddDto } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly url = 'http://localhost:3000/users';
  private readonly http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  getUserById(id: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?id=${id}`);
  }

  addUser(user: UserAddDto): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  updateUser(id: string, user: UserAddDto): Observable<User> {
    return this.http.patch<User>(`${this.url}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
