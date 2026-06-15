import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // 👈 Yeh zaroori hai routerLink aur routerLinkActive directives ko activate karne ke liye
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private router: Router) {}

  /**
   * Secure Session Logout Handler
   * LocalStorage flush karke user ko safely landing login route par drop karega
   */
  logout(): void {
    // Session state completely wipe out karna
    localStorage.clear();
    
    // Auth pipeline redirect logic
    this.router.navigate(['/login']);
  }
}
