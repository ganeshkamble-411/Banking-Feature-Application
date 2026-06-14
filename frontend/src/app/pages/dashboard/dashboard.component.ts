import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { NavbarComponent } from '../../components/navbar/navbar';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
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
  showDepositModal = false;
  showWithdrawModal = false;
  showTransferModal = false;

  // --- TWO-STEP USER PROFILE WIZARD & DROPDOWN FLAGS ---
  showProfileWizard = true;   
  currentProfileStep = 1;     
  showProfileDropdown = false; 

  // Writable Two-Step Profile Preferences Payload
  profileSetupRequest = {
    fullName: '',
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

  account: any;

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
      
      // Profile session state management
      const profileStatus = localStorage.getItem(`profile_completed_user_${this.currentUserId}`);
      if (profileStatus === 'true') {
        this.showProfileWizard = false;
        
        this.profileSetupRequest.fullName = localStorage.getItem(`profile_name_user_${this.currentUserId}`) || 'Active Developer';
        this.profileSetupRequest.phoneNumber = localStorage.getItem(`profile_phone_user_${this.currentUserId}`) || '9999999999';
        this.profileSetupRequest.dailyLimit = Number(localStorage.getItem(`profile_limit_user_${this.currentUserId}`) || 50000);
        this.profileSetupRequest.twoFactorAuth = localStorage.getItem(`profile_2fa_user_${this.currentUserId}`) === 'true';
      } else {
        this.showProfileWizard = true;
      }
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

  // --- PROFILE INTERACTIVE LOGIC ---
  toggleProfileMenu(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  goToNextProfileStep(): void {
    if (this.currentProfileStep < 2) {
      this.currentProfileStep++;
    }
  }

  goToPrevProfileStep(): void {
    if (this.currentProfileStep > 1) {
      this.currentProfileStep--;
    }
  }

  submitUserProfileWizard(): void {
    if (!this.profileSetupRequest.fullName || !this.profileSetupRequest.phoneNumber) {
      alert('Please fill out your Name and Phone Number parameters before submitting.');
      return;
    }

    console.log('Synchronizing user state profiles payload:', this.profileSetupRequest);
    
    localStorage.setItem(`profile_completed_user_${this.currentUserId}`, 'true');
    localStorage.setItem(`profile_name_user_${this.currentUserId}`, this.profileSetupRequest.fullName);
    localStorage.setItem(`profile_phone_user_${this.currentUserId}`, this.profileSetupRequest.phoneNumber);
    localStorage.setItem(`profile_limit_user_${this.currentUserId}`, String(this.profileSetupRequest.dailyLimit));
    localStorage.setItem(`profile_2fa_user_${this.currentUserId}`, String(this.profileSetupRequest.twoFactorAuth));

    this.showProfileWizard = false;

    setTimeout(() => {
      this.initCharts();
    }, 150);
  }

  depositMoney(): void {
    this.transactionService.deposit(this.depositRequest).subscribe({
      next: (response) => {
        alert(response);
        if (this.depositRequest.amount) {
          this.totalCredit += this.depositRequest.amount;
        }
        this.showDepositModal = false;
        this.loadUserAccountDetails();
        this.depositRequest.amount = null;
      },
      error: (err) => console.error(err)
    });
  }

  withdrawMoney(): void {
    this.transactionService.withdraw(this.withdrawRequest).subscribe({
      next: (response) => {
        alert(response);
        if (this.withdrawRequest.amount) {
          this.totalDebit += this.withdrawRequest.amount;
        }
        this.showWithdrawModal = false;
        this.loadUserAccountDetails();
        this.withdrawRequest.amount = null;
      },
      error: (err) => console.error(err)
    });
  }

  transferMoney(): void {
    this.transactionService.transfer(this.transferRequest).subscribe({
      next: (response) => {
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
      error: (err) => console.error(err)
    });
  }

  createAccount(): void {
    this.accountService.createAccount(this.createAccountRequest).subscribe({
      next: (response: any) => {
        alert('Account Created Successfully');
        this.account = response;
        this.currentAccountId = response.id;
        this.loadUserAccountDetails();
        this.showCreateAccountModal = false;
      },
      error: (err) => console.error(err)
    });
  }

  ngAfterViewInit(): void {
    if (!this.showProfileWizard) {
      this.initCharts();
    }
  }

  initCharts(): void {
    const ctx1 = document.getElementById('balanceChart') as HTMLCanvasElement | null;
    const ctx2 = document.getElementById('analysisChart') as HTMLCanvasElement | null;

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
            backgroundColor: 'rgba(37, 99, 235, 0.1)', 
            borderColor: '#2563eb', 
            borderWidth: 2,
            tension: 0.3, 
            pointBackgroundColor: '#2563eb',
            pointHoverRadius: 6,
            pointRadius: 2
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
                font: { family: "'Inter', sans-serif", size: 11 },
                color: '#64748b'
              }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                font: { family: "'Inter', sans-serif", size: 11 },
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
            label: 'Transactions',
            data: [this.totalCredit, this.totalDebit],
            backgroundColor: ['#10b981', '#ef4444'], 
            borderRadius: 6,
            borderWidth: 0
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
              grid: { color: '#f1f5f9' },
              ticks: {
                callback: function(value) { return '₹' + Number(value).toLocaleString('en-IN'); }
              }
            }
          }
        }
      });
    }
  }

  updateChartsDynamic(): void {
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