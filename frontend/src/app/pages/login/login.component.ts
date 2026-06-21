import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms'; // 👈 FIXED: FormsModule import kiya
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CommonModule], // 👈 FIXED: imports me FormsModule add kiya takki ngModel chal sake
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  forgotForm!: FormGroup;
  submitted = false;

  // 🛠️ FIXED: Saare modal variables define kiye jo HTML me missing the
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

      // FIXED: Validators.pattern() me sahi regex inject kiya hai (Note: pattern me 's' nahi hota, sirf 'pattern' hota hai)
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
      // FIXED: Aapka wahi regular expression yahan lagaya hai (min 3 numbers, 1 symbol)
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

    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('Server Response Raw:', response);

        let resObj: any = response;
        if (typeof response === 'string') {
          try {
            resObj = JSON.parse(response);
          } catch (e) {
            console.error('Parsing error', e);
          }
        }

        if (resObj && (resObj.status === 'SUCCESS' || resObj.message?.includes('Successful'))) {
          console.log('Login Success. Navigating now...');

          localStorage.setItem('authToken', 'dummy-session-token');
          localStorage.setItem('userEmail', loginData.email);

          if (resObj.userId) {
            localStorage.setItem('loggedInUserId', resObj.userId.toString());
          }
          if (resObj.accountId) {
            localStorage.setItem('accountId', resObj.accountId.toString());
          }

          this.router.navigate(['/dashboard']).then((navigated) => {
            if (navigated) {
              console.log('Successfully reached Dashboard!');
            } else {
              console.error('Navigation failed! Check Guards or Routes.');
            }
          });
        } else {
          alert(resObj.message || 'Authentication Failed');
        }
      },
      error: (error: any) => {
        console.error('Login error context:', error);
        let serverErrorMessage = 'Login Failed! Server connection refused or credentials mismatch.';

        if (error.error) {
          try {
            const errObj = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
            if (errObj && errObj.message) {
              serverErrorMessage = errObj.message;
            }
          } catch (e) {
            if (typeof error.error === 'string' && error.error.length < 100) {
              serverErrorMessage = error.error;
            }
          }
        }
        alert(serverErrorMessage);
      },
    });
  }

  // 🔑 FIXED: Modal ko open karne ka method
  openForgotModal() {
    this.showForgotModal = true;
    // Agar user ne login field me email pehle se dala hai, toh wahi default modal me set ho jaye
    this.forgotEmail = this.loginForm.value.email || '';
    this.forgotNewPassword = '';
  }

  // 🔑 FIXED: Modal ko close karne ka method
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
