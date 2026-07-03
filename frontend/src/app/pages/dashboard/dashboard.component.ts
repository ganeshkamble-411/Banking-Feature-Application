import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component'; 
import { ProfileWizardComponent } from './profile-wizard/profile-wizard.component'; 
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { HttpClient } from '@angular/common/http'; 
import { RightSidebarComponent } from '../../components/rightsidebar/rightsidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent, 
    ProfileWizardComponent, 
    FormsModule,
    RightSidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  totalBalance = 0;
  totalCredit = 0;
  totalDebit = 0;
  
  // Extra fields dashboard response se summary ke liye
  accountNumber = '';
  accountType = '';
  recentTransactions: any[] = [];
  
  currentUserId!: number;    
  currentAccountId!: number; 
  userEmail: string | null = null;

  // 👁️ Balance Visibility Toggle Flags (By default true rakh sakte ho agar direct dikhana hai)
  isAssetVisible = false;
  isLiabilityVisible = false;

  // Modals Visibility Flags
  showCreateAccountModal = false;
  showDropupMenu = false;
  showDepositModal = false;
  showWithdrawModal = false;
  showTransferModal = false;

  // --- TWO-STEP USER PROFILE WIZARD & DROPDOWN FLAGS ---
  showProfileWizard = false; 
  showProfileDropdown = false; 

  // Synchronized Profile Preferences State
  profileSetupRequest = {
    name: '',
    email: '',
    phoneNumber: '',
    dailyLimit: 50000,
    twoFactorAuth: false,
    alertsEnabled: true
  };

  // Transaction API Payloads
  createAccountRequest = { userId: null as number | null, initialBalance: 0 };
  depositRequest = { accountId: null as number | null, amount: null as number | null };
  withdrawRequest = { accountId: null as number | null, amount: null as number | null };
  transferRequest = { senderAccountId: null as number | null, receiverAccountId: null as number | null, amount: null as number | null };

  account: any = null;

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private http: HttpClient 
  ) {}

  ngOnInit(): void {
    // 1. LocalStorage se IDs nikalo
    const storedUserId = localStorage.getItem('userId');
    const storedAccountId = localStorage.getItem('accountId');

    if (storedUserId) {
      this.currentUserId = parseInt(storedUserId, 10);
      this.evaluateProfileWizardStatus();
    }
    
    if (storedAccountId) {
      this.currentAccountId = parseInt(storedAccountId, 10);
      // ⚡ FIXED: loadUserAccountDetails ki jagah loadDashboardData() call hoga jo real data lata hai
      this.loadDashboardData();
    } else {
      console.warn("Account ID nahi mili localStorage me!");
    }
  }

  evaluateProfileWizardStatus(): void {
    const profileStatus = localStorage.getItem(`profile_completed_user_${this.currentUserId}`);
    if (profileStatus === 'true') {
      this.showProfileWizard = false;
      this.profileSetupRequest.name = localStorage.getItem(`profile_name_user_${this.currentUserId}`) || localStorage.getItem('loggedInUserName') || 'Premium Customer';
      this.profileSetupRequest.email = localStorage.getItem(`profile_email_user_${this.currentUserId}`) || this.userEmail || 'customer@bank.com';
      this.profileSetupRequest.phoneNumber = localStorage.getItem(`profile_phone_user_${this.currentUserId}`) || '9999999999';
      this.profileSetupRequest.dailyLimit = Number(localStorage.getItem(`profile_limit_user_${this.currentUserId}`) || 50000);
      this.profileSetupRequest.twoFactorAuth = localStorage.getItem(`profile_2fa_user_${this.currentUserId}`) === 'true';
    } else {
      this.showProfileWizard = true;
    }
  }

  // 🔄 New Integrated Dashboard API Call Handler
  loadDashboardData(): void {
    if (!this.currentAccountId) return;
    
    const dashboardUrl = `http://localhost:8080/api/dashboard/${this.currentAccountId}`;
    
    this.http.get<any>(dashboardUrl).subscribe({
      next: (data) => {
        console.log('Dashboard Response Payload Loaded:', data);
        if (data) {
          // ⚡ FIXED: Dono keys safe map ki hain - chahe backend se 'totalBalance' aaye ya 'balance'
          this.totalBalance = data.totalBalance ?? data.balance ?? 0;
          this.totalCredit = data.totalCredit ?? 0;
          this.totalDebit = data.totalDebit ?? 0;
          this.accountNumber = data.accountNumber ?? '';
          this.accountType = data.accountType ?? '';
          this.recentTransactions = data.recentTransactions ?? [];
          
          // Legacy object consistency handle karne ke liye
          this.account = {
            id: this.currentAccountId,
            balance: this.totalBalance,
            accountNumber: this.accountNumber,
            accountType: this.accountType
          };
          
          this.syncFormFields();
        }
      },
      error: (err) => {
        console.error('Failed to load summary details from dashboard API:', err);
      }
    });
  }

  syncFormFields(): void {
    this.depositRequest.accountId = this.currentAccountId;
    this.withdrawRequest.accountId = this.currentAccountId;
    this.transferRequest.senderAccountId = this.currentAccountId;
  }

  toggleProfileMenu(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  toggleAssetBalance(): void {
    this.isAssetVisible = !this.isAssetVisible;
  }

  toggleLiabilityBalance(): void {
    this.isLiabilityVisible = !this.isLiabilityVisible;
  }

  onWizardClosed(): void {
    this.showProfileWizard = false;
    this.evaluateProfileWizardStatus();
  }

  openChangePasswordModal(): void {
    alert('Secure Password Reset Link has been initiated to verification records.');
    this.showProfileDropdown = false;
  }

  logout(): void {
    localStorage.clear(); 
    alert('You have been securely logged out from Core Processing Engine.');
    window.location.href = '/login'; 
  }

  depositMoney(): void {
    this.depositRequest.accountId = this.currentAccountId;

    if (!this.depositRequest.amount || this.depositRequest.amount <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    this.transactionService.deposit(this.depositRequest).subscribe({
      next: (res: any) => {
        alert(res.message || 'Money Deposited Successfully!'); 
        this.showDepositModal = false;
        this.loadDashboardData(); // UI sync automatic reload
        this.depositRequest.amount = null;
      },
      error: (err: any) => {
        alert(err.error?.message || 'Failed to complete deposit.');
      }
    });
  }

  withdrawMoney(): void {
    this.syncFormFields();
    
    if (!this.withdrawRequest.amount || this.withdrawRequest.amount <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }

    this.transactionService.withdraw(this.withdrawRequest).subscribe({
      next: (res: any) => {
        alert(res.message || 'Money Withdrawn Successfully!'); 
        this.showWithdrawModal = false;
        this.loadDashboardData(); // UI sync automatic reload
        this.withdrawRequest.amount = null;
      },
      error: (err: any) => {
        alert(err.error?.message || 'Withdrawal failed.');
      }
    });
  }

  transferMoney(): void {
    this.syncFormFields();
    
    if (!this.transferRequest.receiverAccountId) {
      alert("Please enter Receiver Account ID.");
      return;
    }
    if (!this.transferRequest.amount || this.transferRequest.amount <= 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }

    this.transactionService.transfer(this.transferRequest).subscribe({
      next: (res: any) => {
        alert(res.message || 'Money Transferred Successfully!'); 
        this.showTransferModal = false;
        this.loadDashboardData(); // UI sync automatic reload
        this.transferRequest = {
          senderAccountId: this.currentAccountId,
          receiverAccountId: null,
          amount: null
        };
      },
      error: (err: any) => {
        alert(err.error?.message || 'Transfer failed. Check balance/Account ID.');
      }
    });
  }

  createAccount(): void {
    this.accountService.createAccount(this.createAccountRequest).subscribe({
      next: (response: any) => {
        alert('Secure Banking Account Created Successfully');
        this.account = response;
        this.currentAccountId = response.id;
        localStorage.setItem('accountId', this.currentAccountId.toString());
        this.loadDashboardData(); // Naya account aate hi dashboard reload karega
        this.showCreateAccountModal = false;
      },
      error: (err: any) => console.error(err)
    });
  }
}



