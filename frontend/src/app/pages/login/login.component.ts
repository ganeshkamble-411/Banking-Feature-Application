import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  forgotForm!: FormGroup;
  submitted = false;

  // 🛠️ Saare modal variables defined
  showForgotModal = false;
  forgotEmail = '';
  forgotNewPassword = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=(?:.*?\d){3})(?=.*?[#?!@$%^&*-]).*$/),
          Validators.minLength(8),
        ],
      ],
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=(?:.*?\d){3})(?=.*?[#?!@$%^&*-]).*$/),
          Validators.minLength(8),
        ],
      ],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  loginUser() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    // 🔷 Subscribing to the new clean JSON-based login stream
    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('Processed Server Response:', response);

        // AuthService ke successful item emission ke baad dashboard par direct traverse karein
        if (response && response.status === 'SUCCESS') {
          console.log('Login Success. Navigating to dashboard...');
          
          this.router.navigate(['/dashboard']).then((navigated) => {
            if (navigated) {
              console.log('Successfully reached Dashboard!');
            } else {
              console.error('Navigation failed! Check Guards or Routes.');
            }
          });
        } else {
          alert(response.message || 'Authentication Failed');
        }
      },
      error: (error: any) => {
        console.error('Login error context:', error);
        let serverErrorMessage = 'Login Failed! Server connection refused or credentials mismatch.';

        // Clean object structure parse mapper block for exceptions
        if (error.error) {
          if (typeof error.error === 'object' && error.error.message) {
            serverErrorMessage = error.error.message;
          } else if (typeof error.error === 'string') {
            try {
              const errObj = JSON.parse(error.error);
              if (errObj && errObj.message) {
                serverErrorMessage = errObj.message;
              }
            } catch (e) {
              if (error.error.length < 100) {
                serverErrorMessage = error.error;
              }
            }
          }
        }
        alert(serverErrorMessage);
      },
    });
  }

  // 🔑 Modal open karne ka method
  openForgotModal() {
    this.showForgotModal = true;
    
    // Agar user ne login input field me pehle se email dala hai, toh wahi password reset window me auto-populate ho jaye
    const currentEmail = this.loginForm.value.email || '';
    this.forgotForm.patchValue({ email: currentEmail });
  }

  // 🔑 Modal close karne ka method
  closeForgotModal() {
    this.showForgotModal = false;
    this.forgotForm.reset();
  }

  submitDirectPasswordReset() {
    if (this.forgotForm.valid) {
      const payload = this.forgotForm.value;
      console.log('Reset Password Data:', payload);

      this.authService.forgotPasswordReset(payload).subscribe({
        next: (res: any) => {
          alert('Password successfully reset! Ab aap login kar sakte hain.');
          this.closeForgotModal();
        },
        error: (err: any) => {
          console.error('Reset error:', err);
          alert(
            err.error?.message ||
              'Password reset fail ho gaya, kripya sahi registered email dalein.',
          );
        },
      });
    } else {
      // Agar form invalid hai toh saare fields ko touch mark karo taaki error red lines dikhen
      this.forgotForm.markAllAsTouched();
    }
  }
}