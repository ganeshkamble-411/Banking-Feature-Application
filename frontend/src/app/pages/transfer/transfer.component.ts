import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';

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
    senderAccountId: null as number | null,
    receiverAccountId: null as number | null,
    amount: null as number | null
  };

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService 
  ) {}

  ngOnInit(): void {
    const sessionUserId = localStorage.getItem('loggedInUserId');

    if (sessionUserId) {
      this.currentUserId = Number(sessionUserId);

      // Resolving database account primary identifiers dynamically
      this.accountService.getAccountByUserId(this.currentUserId).subscribe({
        next: (account: any) => {
          if (account && account.id) {
            this.transferData.senderAccountId = account.id;
          }
        },
        error: (err) => {
          console.error('Failed to locate transfer execution sender origin context:', err);
        }
      });
    } else {
      console.warn("No active session user ID found in localStorage.");
    }
  }

  transferMoney(): void {
    if (!this.transferData.senderAccountId) {
      alert("Security Error: Sender identity could not be verified. Please log in again.");
      return;
    }
    if (!this.transferData.receiverAccountId || !this.transferData.amount || this.transferData.amount <= 0) {
      alert("Invalid Inputs: Please declare a valid recipient identity token and non-zero transactional value.");
      return;
    }
    if (this.transferData.senderAccountId === this.transferData.receiverAccountId) {
      alert("Validation Error: Destination identifier cannot be identical to the origin root.");
      return;
    }

    this.transactionService
      .transfer(this.transferData)
      .subscribe({
        next: (response) => {
          // Response success handle alerts matching premium corporate structures
          alert("Transaction Successful ✅: " + response);
          this.transferData.receiverAccountId = null;
          this.transferData.amount = null;
        },
        error: (err) => {
          console.error('Transfer rejected by backend process API:', err);
          alert("Transfer Authorization Refused! Kindly check your daily limits or routing accuracy.");
        }
      });
  }
}

