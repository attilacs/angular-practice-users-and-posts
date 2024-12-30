import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';

export const routes: Routes = [
    { path: 'home', title: 'Home', component: HomeComponent },
    { path: 'users', title: 'Users', component: UsersComponent },
    { path: 'users/edit/:id', title: 'Edit User', component: UserEditComponent },
    { path: 'users/new', title: 'Add User', component: UserEditComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', title: 'Not Found', component: PageNotFoundComponent },
];
