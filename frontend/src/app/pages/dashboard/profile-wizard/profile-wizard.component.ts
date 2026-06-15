import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Profile Update Request Structure Interface
interface ProfileUpdateRequest {
  dailyLimit: number | null;
  twoFactorAuth: boolean;
  notificationEnabled: boolean;
}

@Component({
  selector: 'app-profile-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-wizard.component.html',
  styleUrl: './profile-wizard.component.css'
})
export class ProfileWizardComponent implements OnInit {

  // Modal Control States
  @Input() showProfileWizard: boolean = true;
  @Input() currentUserId: number = 0;
  @Input() currentAccountId: number = 0;
  @Input() account: any = { accountNumber: '' };

  currentStep: number = 1;

  // Form Request Model Object initialization
  profileUpdateRequest: ProfileUpdateRequest = {
    dailyLimit: null,
    twoFactorAuth: false,
    notificationEnabled: false
  };

  constructor() {}

  ngOnInit(): void {
    // Component lifecycle init handles
    console.log('Wizard Initialized for Account ID:', this.currentAccountId);
  }

  // Multi-step navigation flows
  nextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Submit Operations to persistent handlers
  submitProfileDetails(): void {
    if (!this.profileUpdateRequest.dailyLimit || this.profileUpdateRequest.dailyLimit <= 0) {
      alert("Please enter a valid daily transaction limit.");
      return;
    }

    const compiledPayload = {
      userId: this.currentUserId,
      accountId: this.currentAccountId,
      accountNumber: this.account?.accountNumber || this.account?.account_number,
      ...this.profileUpdateRequest
    };

    console.log('Sending Profile Update Data to Backend Node:', compiledPayload);
    
    // Yahan aap apna backend service API trigger kar sakte hain
    alert("Profile setup configuration saved securely! Redirecting to your dashboard...");
    
    this.showProfileWizard = false; // Modal turns off once saved
  }
}
