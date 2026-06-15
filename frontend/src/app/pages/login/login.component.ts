import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() { return this.loginForm.controls; }

  loginUser() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData)
      .subscribe({
        next: (response: any) => {
          console.log('Server Response:', response);
          
          // FIXED: Ab string compare nahi, response ke status object key ko read karein
          if (response && response.status === 'SUCCESS') {
            alert('Login Successful!');
            
            // Storing user context email for persistent display session mapping
            localStorage.setItem('userEmail', loginData.email); 
            
            // Redirect smoothly to the dashboard route
            this.router.navigate(['/dashboard']);
          } else {
            // Agar server running hai par credentials galat hain (401 handled gracefully)
            alert(response.message || 'Invalid Credentials! Please try again.');
          }
        },
        error: (error: any) => {
          console.error('Login error context:', error);
          alert('Login Failed! Server is not responding or connection refused.');
        }
      });
  }
}
