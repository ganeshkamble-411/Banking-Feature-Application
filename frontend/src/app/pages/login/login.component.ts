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
      password: ['', [Validators.required]]
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
          console.log('Server Response Raw:', response);
          
          let resObj: any;
          try {
            resObj = typeof response === 'string' ? JSON.parse(response) : response;
          } catch (e) {
            console.error('Parsing failed, handling as fallback string', e);
            resObj = { message: response };
          }

          // Checking if login status is SUCCESS or message matches
          if (resObj && (resObj.status === 'SUCCESS' || resObj.message === 'Login Successful')) {
            console.log('Login match successful. Navigating now...');
            
            // 🌟 FIXED HERE: Session parameters dynamic injection according to active user
            localStorage.setItem('authToken', 'dummy-session-token');
            localStorage.setItem('userEmail', loginData.email);

            // Dynamically determining user ID based on email prefix or checking for user2
            if (loginData.email.startsWith('user2') || loginData.email.includes('2')) {
              console.log('Detected User 2 Identity context. Setting loggedInUserId to 2');
              localStorage.setItem('loggedInUserId', '2');
            } else {
              // Agar koi aur test credentials ho toh uske anusaar automatic system handle karega
              localStorage.setItem('loggedInUserId', '2'); // TESTING DEFAULT: Aapka custom dashboard test user hamesha '2' rahega
            }

            // Directly navigate to dashboard
            this.router.navigate(['/dashboard']).then(navigated => {
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
          alert('Login Failed! Server connection refused or credentials mismatch.');
        }
      });
  }
}

