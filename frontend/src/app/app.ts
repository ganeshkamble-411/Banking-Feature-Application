import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router'; // FIXED: Router import kiya path check karne ke liye
import { CommonModule } from '@angular/common'; // FIXED: NgIf directives ko enable karne ke liye

import { HeaderComponent } from './components/header/header.component'; 
import { SidebarComponent } from './components/sidebar/sidebar.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,   // FIXED: CommonModule ko yahan add kiya taaki *ngIf chal sake
    RouterOutlet, 
    HeaderComponent,  
    SidebarComponent  
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // FIXED: Constructor me router inject kiya hai
  constructor(private router: Router) {}

  // Yeh function check karega ki user abhi login page par hai ya nahi
  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }
}