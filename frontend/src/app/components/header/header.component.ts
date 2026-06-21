import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Agar standalone component hai toh CommonModule zaroori hai *ngIf ke liye

@Component({
  selector: 'app-header',
  standalone: true, // Agar aap angular ke naye version par ho toh standalone true hoga
  imports: [CommonModule], // *ngIf ko handle karne ke liye
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  // 1. Dropdown ki state ko track karne ke liye variable (Pehle yeh missing tha)
  isDropdownOpen: boolean = false;

  constructor() {}

  // 2. Click handle karne ka method (Pehle yeh bhi missing tha)
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Click events ko bubble up hone se rokega
    this.isDropdownOpen = !this.isDropdownOpen; // Toggle logic (True ka false, false ka true)
  }
}

