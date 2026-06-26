import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceRequest {
  icon: string;
  name: string;
}

interface WhatsNewItem {
  icon: string;
  bgClass: string;
  text: string;
  linkText: string;
  linkUrl: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.ts.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  
  // Popular services data array
  services: ServiceRequest[] = [
    { icon: '🏠', name: 'Correspondence address update' },
    { icon: '🏢', name: 'Change of home branch' },
    { icon: '✉️', name: 'Email ID update' },
    { icon: '👤', name: 'Update nominee' }
  ];

  // What's New data array
  whatsNewList: WhatsNewItem[] = [
    {
      icon: '📊',
      bgClass: 'bg-blue-light',
      text: 'Check your credit score & unlock product recommendations',
      linkText: 'Get free credit score',
      linkUrl: '#'
    },
    {
      icon: '🐷',
      bgClass: 'bg-pink-light',
      text: 'Experience the new deposit journey',
      linkText: 'Create fixed/recurring deposit',
      linkUrl: '#'
    }
  ];

  onServiceClick(serviceName: string) {
    console.log(`Clicked on: ${serviceName}`);
    // Yahan aap Router use karke navigate kar sakte hain
  }
}


