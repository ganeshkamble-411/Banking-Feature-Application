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
            
            // 🌟 FIXED HERE: Hardcoded '2' hatakar ab backend se aane wali real IDs set ho rahi hain
            localStorage.setItem('authToken', 'dummy-session-token');
            localStorage.setItem('userEmail', loginData.email);
            
            if (resObj.userId) {
              localStorage.setItem('loggedInUserId', resObj.userId.toString());
            }
            if (resObj.accountId) {
              localStorage.setItem('accountId', resObj.accountId.toString());
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

