import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {

  transactions: any[] = [];
  currentAccountId!: number;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // 🌟 FIXED: Dashboard ki tarah yahan se bhi context accountId fetch karenge
    const sessionAccountId = localStorage.getItem('accountId');
    
    if (sessionAccountId) {
      this.currentAccountId = Number(sessionAccountId);
      this.loadTransactionHistory();
    } else {
      console.warn('No active account reference found in active session context.');
    }
  }

  loadTransactionHistory(): void {
    if (!this.currentAccountId) return;

    console.log(`Fetching ledger streams from database for Account ID: ${this.currentAccountId}...`);
    
    // 🌟 FIXED: Service hooks dynamic call aur transactions structure population
    this.transactionService.history(this.currentAccountId).subscribe({
      next: (txns: any[]) => {
        console.log('Ledger logs retrieved successfully:', txns);
        // Sahi sequence maintain karne ke liye latest transactions upar dikhayenge (Reverse Array)
        this.transactions = txns ? txns.reverse() : [];
      },
      error: (err: any) => {
        console.error('Failed to resolve transaction statement registry architecture:', err);
      }
    });
  }
}
