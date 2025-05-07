import { Routes } from '@angular/router';
import { GeneralTasksComponent } from './general-tasks/general-tasks.component';
import { TasksComponent } from './tasks.component';
import { PrivateGuard } from './dashboard.guard';

export const TASKS_ROUTES: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [PrivateGuard],
    children: [
      {
        path: 'general-tasks',
        component: GeneralTasksComponent,
        pathMatch: 'full',
        canActivate: [PrivateGuard],
      },
      { path: '', redirectTo: 'general-tasks', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
];
