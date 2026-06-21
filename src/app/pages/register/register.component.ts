import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  user = {
    name: '',
    email: '',
    password: ''
  };

  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


 
  registerUser() {

    if (this.user.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.authService.register(this.user)
      .subscribe({
        next: (response: string) => {

          console.log('Server Response:', response);

          if (response === 'Email already exists') {
            alert('Email already exists');
            return;
          }

          //if(response =)

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