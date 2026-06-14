import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-wizard.component.html',
  styleUrls: ['./profile-wizard.component.css']
})
export class UserProfileWizardComponent implements OnInit {
  
  @Input() currentUserId: number = 0;
  @Input() currentAccountId: number = 0;
  @Input() showProfileWizard: boolean = false;
  @Input() account: any = null;
  
  @Output() wizardCompleted = new EventEmitter<any>();

  // Renamed from currentProfileStep to match template
  currentStep: number = 1; 

  // Renamed from profileSetupRequest to match template
  profileUpdateRequest = {
    fullName: '',
    phoneNumber: '',
    dailyLimit: 50000,
    twoFactorAuth: false,
    notificationEnabled: true
  };

  constructor() { }

  ngOnInit(): void {
    const sessionUserId = localStorage.getItem('loggedInUserId');
    if (sessionUserId && !this.currentUserId) {
      this.currentUserId = Number(sessionUserId);
    }
  }

  // Renamed from goToNextProfileStep to match template
  nextStep(): void {
    this.currentStep = 2;
  }

  // Renamed from goToPrevProfileStep to match template
  prevStep(): void {
    this.currentStep = 1;
  }

  // Renamed from submitUserProfileWizard to match template
  submitProfileDetails(): void {
    if (this.profileUpdateRequest.dailyLimit <= 0) {
      alert('Please enter a valid daily transaction limit.');
      return;
    }

    localStorage.setItem(`profile_completed_user_${this.currentUserId}`, 'true');
    localStorage.setItem(`profile_limit_user_${this.currentUserId}`, this.profileUpdateRequest.dailyLimit.toString());
    localStorage.setItem(`profile_2fa_user_${this.currentUserId}`, this.profileUpdateRequest.twoFactorAuth.toString());

    this.wizardCompleted.emit(this.profileUpdateRequest);
  }
}