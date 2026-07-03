import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
  userEmail: string | null = null;
  currentAccountId: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchSessionData();
  }

  // 🔄 Ek reusable helper method data pull karne ke liye
  private fetchSessionData(): void {
    this.userEmail = localStorage.getItem('email');
    
    // Kuch login templates me key 'accountId' hoti hai aur kuch me 'account_id'
    // Dono checks rakh lete hain taaki safe rahe
    this.currentAccountId = localStorage.getItem('accountId') || localStorage.getItem('account_id');
    
    console.log("Sidebar dynamic state values retrieved:", {
      email: this.userEmail,
      accountId: this.currentAccountId
    });
  }

  /**
   * Open User Profile Modal Popup
   */
  openProfileModal(): void {
    // Modal khulne ke fraction second pehle fresh data storage se read hoga
    this.fetchSessionData();
    this.showProfileModal = true;
  }

  /**
   * Close User Profile Modal Popup
   */
  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  /**
   * Secure Session Logout Handler
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

