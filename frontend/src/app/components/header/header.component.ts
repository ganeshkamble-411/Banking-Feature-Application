import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedInUser: string = 'Guest User';

  ngOnInit(): void {
    // FIXED: Key matching with AuthService login pipeline string map
    const sessionName = localStorage.getItem('loggedInUserName');
    if (sessionName) {
      this.loggedInUser = sessionName.toUpperCase();
    }
  }
}