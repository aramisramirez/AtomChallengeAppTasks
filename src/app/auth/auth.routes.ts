import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
