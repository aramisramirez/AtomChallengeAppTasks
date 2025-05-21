import { Component } from '@angular/core';
import { Task, TasksService } from '../services/tasks.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-general-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbTooltipModule],
  templateUrl: './general-tasks.component.html',
  styleUrl: './general-tasks.component.css',
})
export class GeneralTasksComponent {
  taskForm: FormGroup;
  filterForm: FormGroup;
  tasks: Task[] = [];
  userEmail: string | null = null;

  constructor(private fb: FormBuilder, private taskService: TasksService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.filterForm = this.fb.group({
      title: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.userEmail = this.getUserEmailFromToken();

    if (!this.userEmail) {
      console.error('No se pudo obtener el userEmail desde el token');
      return;
    }

    this.filterForm.addControl(
      'visibleUserEmail',
      this.fb.control({ value: this.userEmail, disabled: true })
    );

    this.applyFilters();
  }

  getUserEmailFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.userEmail || payload.email || null;
    } catch (error) {
      console.error('Error al extraer userEmail del token', error);
      return null;
    }
  }

  // applyFilters(): void {
  //   if (!this.userEmail) return;

  //   const filters = {
  //     email: this.userEmail, // CAMBIO AQUÍ
  //     title: this.filterForm.get('title')?.value || '',
  //     startDate: this.filterForm.get('startDate')?.value || '',
  //     endDate: this.filterForm.get('endDate')?.value || '',
  //   };

  //   this.taskService.getTasksWithFilters(filters).subscribe((data) => {
  //     this.tasks = data;
  //   });
  // }

  applyFilters(): void {
    if (!this.userEmail) return;

    const filters = {
      email: this.userEmail,
      title: this.filterForm.get('title')?.value || '',
      startDate: this.filterForm.get('startDate')?.value || '',
      endDate: this.filterForm.get('endDate')?.value || '',
    };

    this.taskService.getTasksWithFilters(filters).subscribe((data) => {
      console.log('📝 Tareas recibidas:', data);
      this.tasks = data.map((task) => ({
        ...task,
        createdAt: this.convertToDate(task.createdAt) || new Date(0),
      }));
    });
  }

  private convertToDate(input: any): Date | null {
    if (!input) {
      console.warn('❌ createdAt está vacío o nulo:', input);
      return null;
    }

    if (typeof input.toDate === 'function') {
      return input.toDate();
    }
    if (
      typeof input === 'object' &&
      '_seconds' in input &&
      typeof input._seconds === 'number'
    ) {
      return new Date(
        input._seconds * 1000 + (input._nanoseconds ?? 0) / 1000000
      );
    }
    if (
      typeof input === 'object' &&
      'seconds' in input &&
      typeof input.seconds === 'number'
    ) {
      return new Date(
        input.seconds * 1000 + (input.nanoseconds ?? 0) / 1000000
      );
    }

    const date = new Date(input);
    if (isNaN(date.getTime())) {
      console.warn('❌ Fecha inválida detectada:', input);
      return null;
    }

    return date;
  }

  addTask(): void {
    if (this.taskForm.invalid || !this.userEmail) return;

    const task = {
      ...this.taskForm.value,
      completed: false,
      userEmail: this.userEmail,
    };

    this.taskService.addTask(task).subscribe((newTask: any) => {
      this.tasks.push(newTask);
      this.taskForm.reset();
      this.applyFilters();
      Swal.fire({
        title: '¡Se a guardado la tarea exitosamente!',
        icon: 'success',
        draggable: true,
      });
    });
  }

  toggleTask(task: Task): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿Estas seguro/a que deseas cambiar el estado de la tarea?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Si, Quiero!',
        cancelButtonText: '¡No, Cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const updated = { ...task, completed: !task.completed };
          this.taskService.updateTask(updated).subscribe(() => {
            task.completed = !task.completed;
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.tasks = [];
          this.applyFilters();
          swalWithBootstrapButtons.fire({
            title: 'Cancelado',
            text: 'Se cancelo la operación',
            icon: 'error',
          });
        }
      });
  }

  deleteTask(id: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿Estas seguro/a que deseas borrar la tarea?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Si, Quiero!',
        cancelButtonText: '¡No, Cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.taskService.deleteTask(id).subscribe(() => {
            this.tasks = this.tasks.filter((t) => t.id !== id);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelado',
            text: 'Se cancelo la operación',
            icon: 'error',
          });
        }
      });
  }
}
