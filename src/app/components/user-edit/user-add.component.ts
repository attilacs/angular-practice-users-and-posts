import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent {
  private service = inject(UserService);
  private router = inject(Router);
  isError = false;
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
