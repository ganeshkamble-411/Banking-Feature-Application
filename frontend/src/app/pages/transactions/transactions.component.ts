import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http'; // 👈 Direct API hit karne ke liye import kiya

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

  constructor(private http: HttpClient) {} // 👈 HttpClient inject kiya

  ngOnInit(): void {
    // Session context se active accountId nikalna
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

    const apiUrl = `http://localhost:8080/api/transaction/history/${this.currentAccountId}`;
    console.log(`Fetching ledger streams from database: ${apiUrl}`);
    
    this.http.get<any[]>(apiUrl).subscribe({
      next: (txns: any[]) => {
        console.log('Ledger logs retrieved successfully from backend:', txns);
        // Latest transactions ko sabse upar dikhane ke liye reverse array kiya
        this.transactions = txns ? txns.reverse() : [];
      },
      error: (err: any) => {
        console.error('Failed to resolve transaction statement registry:', err);
      }
    });
  }
}

