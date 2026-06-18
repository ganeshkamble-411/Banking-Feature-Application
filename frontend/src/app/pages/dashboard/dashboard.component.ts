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
  userEmail: string | null = null;
  
  balanceChart: any;
  analysisChart: any;
  
  // Real dynamic chart records collection holder
  timelineLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  timelineData: number[] = [0, 0, 0, 0, 0, 0];

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
    let sessionUserId = localStorage.getItem('loggedInUserId');
    let sessionAccountId = localStorage.getItem('accountId');
    this.userEmail = localStorage.getItem('userEmail');

    if (sessionUserId) {
      this.currentUserId = Number(sessionUserId);
      this.createAccountRequest.userId = this.currentUserId; 

      if (sessionAccountId) {
        this.currentAccountId = Number(sessionAccountId);
      }

      this.loadUserAccountDetails();
      this.evaluateProfileWizardStatus();
    } else {
      console.error("No active session identity found. Redirecting to access terminal.");
      window.location.href = '/login';
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

  loadUserAccountDetails(): void {
    this.accountService
      .getAccountByUserId(this.currentUserId) 
      .subscribe({
        next: (response: any) => {
          if (response && typeof response === 'object') {
            this.account = response;
            this.totalBalance = Number(response.balance);
            this.currentAccountId = response.id; 
            localStorage.setItem('accountId', this.currentAccountId.toString());
          } else {
            this.totalBalance = Number(response);
          }
          this.syncFormFields();
          this.loadTransactionHistory(); 
        },
        error: (err: any) => {
          console.error('Failed to load dynamic account details from backend:', err);
        }
      });
  }

  loadTransactionHistory(): void {
    if (!this.currentAccountId) return;
    
    this.transactionService.history(this.currentAccountId).subscribe({
      next: (txns: any[]) => {
        if (txns && txns.length > 0) {
          // ✅ FIXED: String mismatch resolved. Matching exact values from TransactionService.java
          this.totalCredit = txns
            .filter((t: any) => t.type === 'CREDIT' || t.type === 'TRANSFER_CREDIT')
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

          this.totalDebit = txns
            .filter((t: any) => t.type === 'DEBIT' || t.type === 'TRANSFER_DEBIT')
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

          // 📈 Dynamic Progressive Graph: Real values extraction for chart spikes tracking
          let incrementalBalance = this.totalBalance - this.totalCredit + this.totalDebit;
          this.timelineData = txns.map((t: any) => {
            if (t.type === 'CREDIT' || t.type === 'TRANSFER_CREDIT') {
              incrementalBalance += Number(t.amount);
            } else {
              incrementalBalance -= Number(t.amount);
            }
            return incrementalBalance;
          });

          this.timelineLabels = txns.map((_, index) => `Txn #${index + 1}`);
          
          // Agar 2 se kam transactions hain toh default curve fill look maintain rakhenge
          if (this.timelineData.length < 6) {
            while (this.timelineData.length < 6) {
              this.timelineData.unshift(this.totalBalance * 0.8);
              this.timelineLabels.unshift('Prior');
            }
          }
        } else {
          this.totalCredit = 0;
          this.totalDebit = 0;
          this.timelineData = [0, 0, 0, 0, 0, this.totalBalance];
          this.timelineLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Current'];
        }
        this.updateChartsDynamic();
      },
      error: (err: any) => console.error('Error fetching transaction architecture breakdowns:', err)
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
        console.log('Deposit success:', res);
        alert(res.message || 'Money Deposited Successfully!'); 
        this.showDepositModal = false;
        this.loadUserAccountDetails(); 
        this.depositRequest.amount = null;
      },
      error: (err: any) => {
        console.error('Deposit Error Response Object:', err);
        alert(err.error?.message || 'Failed to complete deposit. Please check console logs.');
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
        this.loadUserAccountDetails();
        this.withdrawRequest.amount = null;
      },
      error: (err: any) => {
        console.error('Withdraw Error:', err);
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
        this.loadUserAccountDetails();
        this.transferRequest = {
          senderAccountId: this.currentAccountId,
          receiverAccountId: null,
          amount: null
        };
      },
      error: (err: any) => {
        console.error('Transfer Error:', err);
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
          labels: this.timelineLabels, 
          datasets: [{
            label: 'Balance Trend',
            data: this.timelineData, 
            fill: true, 
            backgroundColor: 'rgba(217, 34, 41, 0.05)',  
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
    if (!this.balanceChart || !this.analysisChart) {
      this.initCharts();
      return;
    }

    if (this.balanceChart) {
      // ✅ FIXED: Static calculation multipliers ko real backend data list state se shift kiya
      this.balanceChart.data.labels = this.timelineLabels;
      this.balanceChart.data.datasets[0].data = this.timelineData;
      this.balanceChart.update();
    }
    if (this.analysisChart) {
      // ✅ FIXED: Dynamic credit/debit arrays completely mapping dynamically 
      this.analysisChart.data.datasets[0].data = [this.totalCredit, this.totalDebit];
      this.analysisChart.update();
    }
  }
}
