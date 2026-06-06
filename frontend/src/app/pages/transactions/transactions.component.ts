import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {

  transactions: any[] = [];
  currentUserId!: number;
  currentAccountId!: number; // This will hold our dynamic account key

  constructor(
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // 1. Fetch user ID dynamically from local browser session storage
    const sessionUserId = localStorage.getItem('loggedInUserId');

    if (sessionUserId) {
      this.currentUserId = Number(sessionUserId);

      // 2. Map the User ID to the correct Account ID just like the dashboard
      if (this.currentUserId === 2) {
        this.currentAccountId = 5;  // Virat Kohli's Account ID
      } else if (this.currentUserId === 1) {
        this.currentAccountId = 1;  // Roman's Account ID
      } else {
        this.currentAccountId = this.currentUserId; // Default fallback fallback
      }

      // 3. Load transactions for the dynamically resolved account identifier
      this.loadTransactions();
    } else {
      console.warn("No active session user ID found in localStorage.");
    }
  }

  loadTransactions() {
    console.log(`Fetching history dynamically for Account ID: ${this.currentAccountId}`);
    
    this.transactionService
      .history(this.currentAccountId)
      .subscribe({
        next: (data) => {
          console.log('Transaction History Payload:', data);
          // Ensure data is an array before assignment to avoid template loop errors
          this.transactions = Array.isArray(data) ? data : [];
        },
        error: (err) => {
          console.error('Failed to load transaction history:', err);
        }
      });
  }
}




