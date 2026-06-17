import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Profile Update Request Structure Interface
interface ProfileUpdateRequest {
  name: string;
  email: string;
  phoneNumber: string;
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

  // FIXED: Dashboard ko data update notification bhejnewale Emitter nodes
  @Output() wizardClosed = new EventEmitter<void>();

  currentStep: number = 1;

  // FIXED: Object structures synchronized with Step 1 and Step 2 fields
  profileUpdateRequest: ProfileUpdateRequest = {
    name: '',
    email: '',
    phoneNumber: '',
    dailyLimit: 50000,
    twoFactorAuth: false,
    notificationEnabled: true
  };

  constructor() {}

  ngOnInit(): void {
    console.log('Wizard Initialized for User ID:', this.currentUserId, 'Account ID:', this.currentAccountId);
    
    // Auto-populate baseline parameters from dynamic session context
    this.profileUpdateRequest.email = localStorage.getItem('userEmail') || '';
    this.profileUpdateRequest.name = localStorage.getItem(`profile_name_user_${this.currentUserId}`) || localStorage.getItem('loggedInUserName') || '';
    this.profileUpdateRequest.phoneNumber = localStorage.getItem(`profile_phone_user_${this.currentUserId}`) || '';
    
    let savedLimit = localStorage.getItem(`profile_limit_user_${this.currentUserId}`);
    if (savedLimit) {
      this.profileUpdateRequest.dailyLimit = Number(savedLimit);
    }
  }

  // Multi-step navigation flows
  nextStep(): void {
    if (this.currentStep === 1) {
      if (!this.profileUpdateRequest.name.trim()) {
        alert("Please enter your profile name.");
        return;
      }
      if (!this.profileUpdateRequest.phoneNumber.trim()) {
        alert("Please enter your dynamic contact number.");
        return;
      }
    }
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // FIXED: Submit Operations to persistent state models mapping strictly to active currentUserId
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

    console.log('Saving dynamic isolated profile layer into persistent cache matrix:', compiledPayload);
    
    // Save locally isolated for currently active session identifier (User ID 2 or any)
    localStorage.setItem(`profile_completed_user_${this.currentUserId}`, 'true');
    localStorage.setItem(`profile_name_user_${this.currentUserId}`, this.profileUpdateRequest.name);
    localStorage.setItem(`profile_email_user_${this.currentUserId}`, this.profileUpdateRequest.email);
    localStorage.setItem(`profile_phone_user_${this.currentUserId}`, this.profileUpdateRequest.phoneNumber);
    localStorage.setItem(`profile_limit_user_${this.currentUserId}`, String(this.profileUpdateRequest.dailyLimit));
    localStorage.setItem(`profile_2fa_user_${this.currentUserId}`, String(this.profileUpdateRequest.twoFactorAuth));
    localStorage.setItem(`profile_alerts_user_${this.currentUserId}`, String(this.profileUpdateRequest.notificationEnabled));

    alert("Kotak Profile setup configuration saved securely!");
    
    // FIXED: Trigger dashboard to refresh metrics array layer and dismiss overlay
    this.wizardClosed.emit();
  }
}





