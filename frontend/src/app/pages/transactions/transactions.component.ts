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
    const sessionUserId = localStorage.getItem('loggedInUserId');
    if (sessionUserId) {
      // Yahan aap service se specific account ke records pull kar sakte hain
      this.loadTransactionHistory();
    }
  }

  loadTransactionHistory(): void {
    // service.getTransactions() hook map karein
    console.log('Fetching ledger streams from database...');
  }
}
