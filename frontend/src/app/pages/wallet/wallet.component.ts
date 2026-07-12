import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  // 🟢 totalbalance field jo API response se map hogi
  totalbalance: number = 0.00;
  
  // Screen input fields ke data variables
  inputAccountId: string = '';
  inputAmount: number | null = null;
  
  // API Endpoints
  private addMoneyUrl = 'http://localhost:8080/api/dashboard/add-money';
  private withdrawUrl = 'http://localhost:8080/api/transaction/withdraw';
  private dashboardUrl = 'http://localhost:8080/api/dashboard/'; // 🟢 Live Balance Fetch Base URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Session se automatic logged-in user ki account id uthayenge
    const sessionAccount = localStorage.getItem('accountId') || localStorage.getItem('account_id') || '5'; 
    this.inputAccountId = sessionAccount;
    
    // Page load hote hi API se live balance pull karenge
    this.fetchLiveBalance(sessionAccount);
  }

  // 🟢 Live Balance Fetch API Handler (totalbalance read karne ke liye)
  fetchLiveBalance(accountId: string): void {
    if (!accountId || accountId.trim() === '') return;

    this.http.get<any>(`${this.dashboardUrl}${accountId}`).subscribe({
      next: (response) => {
        // Backend response me se 'totalbalance' field read kar rahe hain
        if (response && response.totalbalance !== undefined) {
          this.totalbalance = parseFloat(response.totalbalance);
        } else if (response && response.totalBalance !== undefined) {
          // CamelCase handling ke liye safe check
          this.totalbalance = parseFloat(response.totalBalance);
        }
      },
      error: (err) => {
        console.error('Failed to fetch live balance from dashboard API:', err);
      }
    });
  }

  // Inputs Validation Check
  private isValidInput(): boolean {
    if (!this.inputAccountId || this.inputAccountId.trim() === '') {
      alert("Please enter a valid Account ID.");
      return false;
    }
    if (this.inputAmount === null || isNaN(this.inputAmount) || this.inputAmount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return false;
    }
    return true;
  }

  // 🟢 Add Money Click Action (dashboard/add-money)
  addMoney(): void {
    if (!this.isValidInput()) return;

    const payload = {
      accountId: this.inputAccountId,
      amount: this.inputAmount
    };

    this.http.post<any>(this.addMoneyUrl, payload).subscribe({
      next: (response) => {
        alert(`₹${this.inputAmount} successfully added to Account #${this.inputAccountId}!`);
        this.inputAmount = null; // Field clean karne ke liye
        
        // Transaction ke baad fresh updated balance fetch karne ke liye instant call
        this.fetchLiveBalance(this.inputAccountId);
      },
      error: (err) => {
        console.error('Add Money failed:', err);
        alert('Add Money transaction failed! Please check backend connection.');
      }
    });
  }

  // 🔴 Withdraw Money Click Action (transaction/withdraw)
  withdrawMoney(): void {
    if (!this.isValidInput()) return;

    if (this.inputAmount && this.inputAmount > this.totalbalance) {
      alert("Insufficient balance for this withdrawal.");
      return;
    }

    const payload = {
      accountId: this.inputAccountId,
      amount: this.inputAmount
    };

    this.http.post<any>(this.withdrawUrl, payload).subscribe({
      next: (response) => {
        alert(`₹${this.inputAmount} successfully withdrawn from Account #${this.inputAccountId}!`);
        this.inputAmount = null; // Field clean karne ke liye
        
        // Transaction ke baad fresh updated balance fetch karne ke liye instant call
        this.fetchLiveBalance(this.inputAccountId);
      },
      error: (err) => {
        console.error('Withdrawal failed:', err);
        alert('Withdrawal transaction failed! Please check backend connection.');
      }
    });
  }
}


