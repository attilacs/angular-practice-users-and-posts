import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'users', title: 'Users', component: UsersComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', title: 'Not Found', component: PageNotFoundComponent },
];
