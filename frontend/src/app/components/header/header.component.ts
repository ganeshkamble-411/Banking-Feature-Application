import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  // Dropdown toggle state tracking
  isDropdownOpen: boolean = false;
  
  // 🔷 Central Reactive Stream: Pura component is single stream source se responsive data extract karega
  currentUser$: Observable<UserProfile | null>;

  constructor(private authService: AuthService, private router: Router) {
    // Component initialization ke waqt authService ki state stream bind ki
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // 🔷 Ab kisi bhi manual localStorage micro-check ya fallback function ki zaroorat nahi hai, 
    // kyunki AuthService automatic stream me current updated values push karega.
  }

  // 🔷 Dynamic Initials Generator Engine (Jo HTML me use hoga)
  getAvatarInitials(name: string | undefined): string {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  // Dropdown open/close zone handler
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Event bubbling stop karne ke liye safe wrapper execution
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // 🔷 Clean Logout Action
  logout(): void {
    this.authService.logout(); // AuthService storage clear karega aur stream ko null notify karega
    this.isDropdownOpen = false;
    this.router.navigate(['/login']); // Page clear karke safely login route par traverse karein
  }
}




