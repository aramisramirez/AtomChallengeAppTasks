import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  showConfirm = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const email = this.form.get('email')?.value;
    this.loading = true;

    this.authService.checkUserExists(email).subscribe({
      next: (user: any) => {
        console.log('Usuario encontrado:', user);
        window.localStorage.setItem('token', user.token);
        // this.router.navigate(['/tasks']);
        this.router.navigateByUrl('/tasks', { replaceUrl: true });
      },
      error: (err: any) => {
        if (err.status === 400) {
          this.showConfirm = true;
        } else {
          this.errorMessage =
            'Hubo un error en la autenticación. Intenta nuevamente.';
        }
        this.loading = false;
      },
    });
  }

  cancelCreateUser(): void {
    this.showConfirm = false;
  }

  confirmCreateUser(): void {
    const email = this.form.get('email')?.value;
    this.loading = true;

    this.authService.createUser(email).subscribe({
      next: (user: any) => {
        this.router.navigate(['tasks']);
        this.onSubmit();
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage =
          'Hubo un error al crear el usuario. Intenta nuevamente.';
        this.loading = false;
      },
    });
    this.showConfirm = false;
  }
}
