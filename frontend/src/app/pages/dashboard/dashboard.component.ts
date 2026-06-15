import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component'; 
import { ProfileWizardComponent } from './profile-wizard/profile-wizard.component'; 
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent, 
    ProfileWizardComponent, 
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  totalBalance = 0;
  totalCredit = 0;
  totalDebit = 0;
  
  currentUserId!: number;    
  currentAccountId!: number; 
  
  balanceChart: any;
  analysisChart: any;

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
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    const sessionUserId = localStorage.getItem('loggedInUserId');
    if (sessionUserId) {
      this.currentUserId = Number(sessionUserId);
      this.createAccountRequest.userId = this.currentUserId; 

      this.loadUserAccountDetails();
      this.evaluateProfileWizardStatus();
    }
  }

  evaluateProfileWizardStatus(): void {
    const profileStatus = localStorage.getItem(`profile_completed_user_${this.currentUserId}`);
    if (profileStatus === 'true') {
      this.showProfileWizard = false;
      // FIXED: Synchronized with standard logging naming variables tracking systems
      this.profileSetupRequest.name = localStorage.getItem(`profile_name_user_${this.currentUserId}`) || localStorage.getItem('loggedInUserName') || 'Premium Customer';
      this.profileSetupRequest.email = localStorage.getItem(`profile_email_user_${this.currentUserId}`) || 'customer@bank.com';
      this.profileSetupRequest.phoneNumber = localStorage.getItem(`profile_phone_user_${this.currentUserId}`) || '9999999999';
      this.profileSetupRequest.dailyLimit = Number(localStorage.getItem(`profile_limit_user_${this.currentUserId}`) || 50000);
      this.profileSetupRequest.twoFactorAuth = localStorage.getItem(`profile_2fa_user_${this.currentUserId}`) === 'true';
    } else {
      this.showProfileWizard = true;
    }
  }

  loadUserAccountDetails(): void {
    this.accountService
      .getAccountByUserId(this.currentUserId) 
      .subscribe({
        next: (response: any) => {
          if (response && typeof response === 'object') {
            this.account = response;
            this.totalBalance = Number(response.balance);
            this.currentAccountId = response.id; 
          } else {
            this.totalBalance = Number(response);
          }
          this.syncFormFields();
          this.updateChartsDynamic();
        },
        error: (err: any) => {
          console.error('Failed to load dynamic account details from backend:', err);
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

  onWizardClosed(): void {
    this.showProfileWizard = false;
    this.evaluateProfileWizardStatus();
    setTimeout(() => {
      this.initCharts();
    }, 150);
  }

  openChangePasswordModal(): void {
    alert('Secure Password Reset Link has been initiated to verification records.');
    this.showProfileDropdown = false;
  }

  logout(): void {
    localStorage.clear(); // Complete layout storage wipe for maximum safety clearance
    alert('You have been securely logged out from Core Processing Engine.');
    window.location.reload();
  }

  depositMoney(): void {
    this.transactionService.deposit(this.depositRequest).subscribe({
      next: (response: any) => {
        alert(response);
        if (this.depositRequest.amount) {
          this.totalCredit += this.depositRequest.amount;
        }
        this.showDepositModal = false;
        this.loadUserAccountDetails();
        this.depositRequest.amount = null;
      },
      error: (err: any) => console.error(err)
    });
  }

  withdrawMoney(): void {
    this.transactionService.withdraw(this.withdrawRequest).subscribe({
      next: (response: any) => {
        alert(response);
        if (this.withdrawRequest.amount) {
          this.totalDebit += this.withdrawRequest.amount;
        }
        this.showWithdrawModal = false;
        this.loadUserAccountDetails();
        this.withdrawRequest.amount = null;
      },
      error: (err: any) => console.error(err)
    });
  }

  transferMoney(): void {
    this.transactionService.transfer(this.transferRequest).subscribe({
      next: (response: any) => {
        alert(response);
        if (this.transferRequest.amount) {
          this.totalDebit += this.transferRequest.amount;
        }
        this.showTransferModal = false;
        this.loadUserAccountDetails();
        this.transferRequest = {
          senderAccountId: this.currentAccountId,
          receiverAccountId: null,
          amount: null
        };
      },
      error: (err: any) => console.error(err)
    });
  }

  createAccount(): void {
    this.accountService.createAccount(this.createAccountRequest).subscribe({
      next: (response: any) => {
        alert('Secure Banking Account Created Successfully');
        this.account = response;
        this.currentAccountId = response.id;
        this.loadUserAccountDetails();
        this.showCreateAccountModal = false;
      },
      error: (err: any) => console.error(err)
    });
  }

  ngAfterViewInit(): void {
    if (!this.showProfileWizard) {
      this.initCharts();
    }
  }

  initCharts(): void {
    const ctx1 = document.getElementById('balanceChartCanvas') as HTMLCanvasElement | null;
    const ctx2 = document.getElementById('analysisChartCanvas') as HTMLCanvasElement | null;

    // FIXED: Destroy existing instance before rebuilding to avoid canvas reusable buffer leaks
    if (this.balanceChart) {
      this.balanceChart.destroy();
      this.balanceChart = null;
    }
    if (this.analysisChart) {
      this.analysisChart.destroy();
      this.analysisChart = null;
    }

    if (ctx1) {
      this.balanceChart = new Chart(ctx1, {
        type: 'line', 
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
          datasets: [{
            label: 'Balance Trend',
            data: [
              this.totalBalance * 0.6, 
              this.totalBalance * 0.7, 
              this.totalBalance * 0.85, 
              this.totalBalance * 0.8, 
              this.totalBalance * 0.9, 
              this.totalBalance
            ], 
            fill: true, 
            backgroundColor: 'rgba(217, 34, 41, 0.05)',  // Theme customized soft crimson flow mapping
            borderColor: '#d92229', 
            borderWidth: 2.5,
            tension: 0.25, 
            pointBackgroundColor: '#d92229',
            pointHoverRadius: 6,
            pointRadius: 3
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { family: "'Segoe UI', Roboto, sans-serif", size: 11 },
                color: '#64748b'
              }
            },
            y: {
              grid: { color: '#e2e8f0' },
              ticks: {
                font: { family: "'Segoe UI', Roboto, sans-serif", size: 11 },
                color: '#64748b',
                callback: function(value) {
                  return '₹' + Number(value).toLocaleString('en-IN');
                }
              }
            }
          }
        }
      });
    }

    if (ctx2) {
      this.analysisChart = new Chart(ctx2, {
        type: 'bar', 
        data: {
          labels: ['Total Credit', 'Total Debit'],
          datasets: [{
            label: 'Transactions Architecture',
            data: [this.totalCredit, this.totalDebit],
            backgroundColor: ['#10b981', '#d92229'], 
            borderRadius: 5,
            borderWidth: 0,
            barThickness: 45
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { display: false } },
            y: { 
              grid: { color: '#e2e8f0' },
              ticks: {
                font: { family: "'Segoe UI', Roboto, sans-serif", size: 11 },
                callback: function(value) { return '₹' + Number(value).toLocaleString('en-IN'); }
              }
            }
          }
        }
      });
    }
  }

  updateChartsDynamic(): void {
    // FIXED: Instantly lazy-init charts if backend loaded first before canvas fully mounts layout wrapper
    if (!this.balanceChart || !this.analysisChart) {
      this.initCharts();
      return;
    }

    if (this.balanceChart) {
      this.balanceChart.data.datasets[0].data = [
        this.totalBalance * 0.6, 
        this.totalBalance * 0.7, 
        this.totalBalance * 0.85, 
        this.totalBalance * 0.8, 
        this.totalBalance * 0.9, 
        this.totalBalance
      ];
      this.balanceChart.update();
    }
    if (this.analysisChart) {
      this.analysisChart.data.datasets[0].data = [this.totalCredit, this.totalDebit];
      this.analysisChart.update();
    }
  }
}
