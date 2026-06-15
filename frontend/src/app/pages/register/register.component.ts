import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  
  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$') // Sirf @gmail.com support
      ]],
      password: ['', [Validators.required, Validators.minLength(8)]], // Upgraded to 8 characters
      confirmPassword: ['', Validators.required]
    }, {
      // FIXED: .bind(this) lagana zaroori hai taaki context app component ka hi rahe
      validators: this.passwordMatchValidator.bind(this)
    });
  }

  get f() { return this.registerForm.controls; }

  // FIXED: Parameter ka type AbstractControl ya FormGroup explicitly define karein
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  registerUser() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const formData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    console.log('Initiating Secure Institutional Registration Node...');

    this.authService.register(formData)
      .subscribe({
        next: (response: string) => {
          console.log('Server Response:', response);
          if (response === 'Email already exists') {
            alert('Email already exists! Please use another dynamic enterprise mail identity.');
            return;
          }
          alert('Registration Successful ✅. Welcome to Kotak Core Console Framework.');
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error('Registration registry failure:', error);
          alert('Registration Failed! Please verify security credentials format.');
        }
      });
  }
}