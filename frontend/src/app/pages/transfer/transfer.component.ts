import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [SidebarComponent, FormsModule, CommonModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {

  currentUserId!: number;

  transferData = {
    senderAccountId: null as number | null, // Populated dynamically
    receiverAccountId: null as number | null,
    amount: null as number | null
  };

  constructor(
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // 1. Fetch user ID dynamically from local browser session storage
    const sessionUserId = localStorage.getItem('loggedInUserId');

    if (sessionUserId) {
      this.currentUserId = Number(sessionUserId);

      // 2. Map the logged-in User ID to the exact database Account ID row
      if (this.currentUserId === 2) {
        this.transferData.senderAccountId = 5;  // Virat Kohli's real Account ID
      } else if (this.currentUserId === 1) {
        this.transferData.senderAccountId = 1;  // Roman's Account ID
      } else {
        this.transferData.senderAccountId = this.currentUserId; // Default fallback
      }
      
      console.log(`Transfer context loaded. Sender Account locked to ID: ${this.transferData.senderAccountId}`);
    } else {
      console.warn("No active session user ID found in localStorage.");
    }
  }

  transferMoney() {
    if (!this.transferData.senderAccountId) {
      alert("Error: Sender account could not be resolved. Please log in again.");
      return;
    }
    if (!this.transferData.receiverAccountId || !this.transferData.amount || this.transferData.amount <= 0) {
      alert("Please fill out all fields with valid information.");
      return;
    }

    this.transactionService
      .transfer(this.transferData)
      .subscribe({
        next: (response) => {
          alert(response);
          // Clear inputs after successful money transfer execution
          this.transferData.receiverAccountId = null;
          this.transferData.amount = null;
        },
        error: (err) => {
          console.error('Transfer execution rejected by backend api:', err);
          alert("Transfer Failed! Check receiver account details.");
        }
      });
  }
}