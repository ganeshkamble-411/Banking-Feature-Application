import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ReactiveFormsModule add kiya
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Errors dikhane ke liye zaroori hai
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule], // Modules update kiye
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
    // Pure form ka validation yahan setup hoga
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$') // Sirf @gmail.com validation
      ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator // Custom validator donon password match karne ke liye
    });
  }

  // HTML me aasani se access karne ke liye getter function
  get f() { return this.registerForm.controls; }

  // Custom function check karne ke liye ki dono password same hain ya nahi
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  registerUser() {
    this.submitted = true;

    // Agar form khali hai ya email me @gmail.com nahi hai to yahi rok do
    if (this.registerForm.invalid) {
      return;
    }

    // Agar sab sahi hai to form ka data nikal lo
    const formData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(formData)
      .subscribe({
        next: (response: string) => {
          console.log('Server Response:', response);
          if (response === 'Email already exists') {
            alert('Email already exists');
            return;
          }
          alert('Registration Successful');
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error(error);
          alert('Registration Failed');
        }
      });
  }
}