import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-user-edit',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  private service = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isError = false;
  user$: Observable<User | null> = EMPTY;

  ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      switchMap((param) => {
        const id = param.get('id');
        if (typeof id === 'string' && id !== 'add') {
          return this.service.getUserById(id).pipe(
            map((user) => {
              if (user.length) {
                return user[0];
              }
              return null;
            }),
            catchError((error) => {
              console.error(error);
              return of(null);
            }),
          );
        }
        return of(null);
      }),
    );
  }

  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  addUser(): void {
    const name = this.form.controls.name.value;
    const email = this.form.controls.email.value;
    if (!name || !email) {
      throw new Error('Invalid input data!');
    }
    this.service.addUser({ name, email }).subscribe({
      next: () => {
        this.router.navigate(["/users"]);
      },
      error: () => {
        this.isError = true;
      }
    });
  }
}
