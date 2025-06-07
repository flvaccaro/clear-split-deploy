import { AfterViewInit, Component, ElementRef, OnInit, ViewChild }   from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const lastEmail = localStorage.getItem('lastSignupEmail');
    this.loginForm = this.fb.group({
      email: [lastEmail || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngAfterViewInit() {
    const lastEmail = localStorage.getItem('lastSignupEmail');

    // Si hay un email guardado, hacemos foco al password
    if (lastEmail && this.passwordInput) {
      setTimeout(() => {
        this.passwordInput.nativeElement.focus();
      });
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
