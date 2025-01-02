import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { User } from '../../interfaces/user';

interface UserForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
}

enum SubscriptionKey {
  Init = 'init',
  Save = 'save',
}

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
  private destroyRef = inject(DestroyRef);
  private subScriptions = new Map<SubscriptionKey, Subscription>();
  isError = false;
  userId: string | null = null;
  form: FormGroup<UserForm>;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.unsubscribeAll();
    });

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  ngOnInit(): void {
    this.unsubscribe(SubscriptionKey.Init);
    const initSubscription = this.route.paramMap.pipe(
      switchMap((param) => {
        const id = param.get('id');
        if (id) {
          return this.service.getUserById(id).pipe(
            map((user) => {
              if (user.length) {
                const userData = user[0];
                if (!userData) {
                  return null;
                }
                this.userId = userData.id;
                this.initUserData(userData);
                return userData;
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
    ).subscribe();
    this.subScriptions.set(SubscriptionKey.Init, initSubscription);
  }

  private initUserData(initial?: User) {
    this.form.setValue({
      name: initial?.name ?? '',
      email: initial?.email ?? '',
    })
  }

  saveUser(): void {
    if (!this.form?.valid) {
      return;
    }
    const { name, email } = this.form.value;
    if (!name || !email) {
      throw new Error('Invalid input data!');
    }
    const apiCall: Observable<User> = this.userId
      ? this.service.updateUser(this.userId, { name, email })
      : this.service.addUser({ name, email });

    this.unsubscribe(SubscriptionKey.Save);
    const saveSubscription = apiCall.subscribe({
      next: () => {
        this.router.navigate(["/users"]);
      },
      error: () => {
        this.isError = true;
      }
    });
    this.subScriptions.set(SubscriptionKey.Save, saveSubscription);
  }

  cancel(): void {
    this.router.navigate(["/users"]);
  }

  private unsubscribe(subscriptionKey: SubscriptionKey): void {
    const subscription = this.subScriptions.get(subscriptionKey);
    if (!subscription) {
      return;
    }
    subscription.unsubscribe();
    this.subScriptions.delete(subscriptionKey);
  }

  private unsubscribeAll(): void {
    for (const subScriptions of this.subScriptions.values()) {
      subScriptions.unsubscribe();
    }
    this.subScriptions.clear();
  }
}
