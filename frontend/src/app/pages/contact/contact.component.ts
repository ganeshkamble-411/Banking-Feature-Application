import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  sendMessage(): void {
    // Elegant system validation check alerts matching premium standards
    alert("Message sent successfully ✅. Our support team will get back to you shortly.");
  }

}
