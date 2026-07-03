import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

import { HeaderComponent } from './components/header/header.component'; 
import { SidebarComponent } from './components/sidebar/sidebar.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,   
    RouterOutlet, 
    HeaderComponent,  
    SidebarComponent  
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor(private router: Router) {}

  // FIXED: Ab yeh function login, register aur root teeno authentication paths ko track karega
  isAuthPage(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/';
  }
}