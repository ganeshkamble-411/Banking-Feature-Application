import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; //
import { SidebarComponent } from '../../components/sidebar/sidebar.component'; //
import { HttpClient } from '@angular/common/http'; //

// 💡 Carbon Components ke imports registers kar rahe hain yahan
import '@carbon/web-components/es/components/text-input/index.js';
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/tag/index.js';

@Component({
  selector: 'app-transactions', //
  standalone: true, //
  imports: [CommonModule, SidebarComponent], //
  templateUrl: './transactions.component.html', //
  styleUrl: './transactions.component.css', //
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // 👈 Carbon custom elements allow karne ke liye
})
export class TransactionsComponent implements OnInit {

  transactions: any[] = []; //
  filteredTransactions: any[] = []; // 💡 Search results store karne ke liye array
  currentAccountId!: number; //
  searchQuery: string = '';

  constructor(private http: HttpClient) {} //

  ngOnInit(): void { //
    const sessionAccountId = localStorage.getItem('accountId'); //
    
    if (sessionAccountId) { //
      this.currentAccountId = Number(sessionAccountId); //
      this.loadTransactionHistory(); //
    }
  }

  loadTransactionHistory(): void { //
    if (!this.currentAccountId) return; //

    const apiUrl = `http://localhost:8080/api/transaction/history/${this.currentAccountId}`; //
    
    this.http.get<any[]>(apiUrl).subscribe({ //
      next: (txns: any[]) => { //
        this.transactions = txns ? txns.reverse() : []; //
        this.filteredTransactions = [...this.transactions]; // Shuruat me saara data dikhao
      },
      error: (err: any) => { //
        console.error('Failed to resolve transaction statement registry:', err); //
      }
    });
  }

  // 💡 Carbon Input field ke event se filter karne ka function
  onSearchChange(event: any): void {
    this.searchQuery = event.target.value.toLowerCase();
    
    if (!this.searchQuery) {
      this.filteredTransactions = [...this.transactions];
      return;
    }

    this.filteredTransactions = this.transactions.filter(tx => {
      const accountIdMatch = (tx.account?.id || this.currentAccountId).toString().includes(this.searchQuery);
      const typeMatch = tx.type?.toLowerCase().includes(this.searchQuery);
      return accountIdMatch || typeMatch;
    });
  }
}

