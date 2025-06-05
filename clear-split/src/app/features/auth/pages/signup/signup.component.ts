import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    bankAlias: FormControl<string>;
    name: FormControl<string>;
  }>;
  isSubmitting = false;
  errorMessage = '';
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      bankAlias: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    // lecturas control por control
    const email = this.signupForm.controls.email.value!;
    const password = this.signupForm.controls.password.value!;
    const bankAlias = this.signupForm.controls.bankAlias.value!;
    const name = this.signupForm.controls.name.value!;

    console.log('Signup', { email, password, bankAlias, name });
    this.authService.signup(email, password, bankAlias, name)
    .subscribe({
      next: () => {
        this.isSubmitting = false;
        // ahora sí, redirect efectivo
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error en el registro:', err);
        this.errorMessage = err?.error?.message || 'Error al registrarse. Inténtalo de nuevo más tarde.';
      }
    });
  }
}
