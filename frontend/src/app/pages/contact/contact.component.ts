import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  sendMessage()
  {
    alert("Message sent successfully ✅");
  }

}