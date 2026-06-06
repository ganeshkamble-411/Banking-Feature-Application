import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  loginUser() {

    this.authService.login(this.loginData)
      .subscribe({

        next: (response: string) => {

          console.log(response);

          if (response === 'Login Successful') {

            alert('Login Successful');

            this.router.navigate(['/dashboard']);

          } else {

            alert(response);
          }
        },

        error: (error: any) => {

          console.error(error);

          alert('Invalid Email or Password');
        }
      });
  }
}