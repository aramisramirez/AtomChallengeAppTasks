import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

// export interface Task {
//   id: number;
//   title: string;
//   description: string;
//   completed: boolean;
//   userEmail: string;
// }

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date; // o string con formato de fecha
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTasksWithFilters(filters: {
    email?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<Task[]> {
    const params = new URLSearchParams();

    if (filters.email) params.append('email', filters.email);
    if (filters.title) params.append('title', filters.title);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const urlWithParams = `${this.apiUrl}tasks?${params.toString()}`;
    return this.http.get<Task[]>(urlWithParams);
  }

  addTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl + 'tasks', task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}tasks/${task.id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}tasks/${id}`);
  }
}
