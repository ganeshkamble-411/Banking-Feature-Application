import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  
  // 🔷 Dynamic @Input properties (Default values removed/made dynamic)
  @Input() userName: string = '';
  @Input() userCrn: string = '';
  @Input() userInitials: string = '';

  constructor() {}

  ngOnInit(): void {
    // 🔷 Fail-Safe: Agar parent component se @Input bypass ho jaye ya delay ho, 
    // toh yeh khud directly localStorage se dynamic data fetch kar lega.
    this.loadDynamicFallbackData();
  }

  private loadDynamicFallbackData(): void {
    // Active userId nikalte hain (Aapke dashboard ke logic ke hisab se default 2 hai)
    const currentUserId = Number(localStorage.getItem('userId')) || 2;
    
    // 1. Dynamic Name Read karna
    if (!this.userName) {
      const savedName = localStorage.getItem(`profile_name_user_${currentUserId}`);
      this.userName = savedName ? savedName : 'Ganesh Kamble'; // Agar setup na ho toh dynamic fallback
    }

    // 2. Dynamic Initials Generate karna
    if (!this.userInitials && this.userName) {
      const nameParts = this.userName.trim().split(' ');
      if (nameParts.length > 1) {
        this.userInitials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      } else if (nameParts.length > 0 && nameParts[0]) {
        this.userInitials = nameParts[0][0].toUpperCase();
      } else {
        this.userInitials = 'GK';
      }
    }

    // 3. Dynamic CRN Layer Read karna
    if (!this.userCrn) {
      const savedAccountId = localStorage.getItem('accountId');
      this.userCrn = savedAccountId ? `CRN ${savedAccountId}` : 'CRN 839853068';
    }
  }

  // Dropdown open/close zone handler
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Event bubbling stop karne ke liye
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}





