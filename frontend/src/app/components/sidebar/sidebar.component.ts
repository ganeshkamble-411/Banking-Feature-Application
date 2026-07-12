import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule 
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  showProfileModal = false;
  
  // 🔷 Local storage variables ko hata kar central reactive stream lagayi
  currentUser$: Observable<UserProfile | null>;
  

  constructor(private authService: AuthService, private router: Router) {
    // Header ki tarah stream ko bind kiya
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Ab manual localStorage fetches ki zaroorat nahi hai
  }

  openProfileModal(): void {
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}

