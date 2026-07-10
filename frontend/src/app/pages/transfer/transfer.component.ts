import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'; // 🟢 FormsModule add kiya safe backup ke liye
import { CommonModule } from '@angular/common';

// Import your Transaction Service
import { TransactionService } from '../../services/transaction.service'; 

// IBM Carbon Web Components Registry Imports
import '@carbon/web-components/es/components/ui-shell/index.js';
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/form/index.js';
import '@carbon/web-components/es/components/stack/index.js';
import '@carbon/web-components/es/components/grid/index.js';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // 🟢 ReactiveForms aur FormsModule dono mapped hain
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class TransferComponent implements OnInit {
  transferForm!: FormGroup;
  isSubmitting = false; 

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      senderAccountId: ['', [Validators.required]],
      recipientAccountId: ['', [Validators.required]],
      transferAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onTransferSubmit(): void {
    console.log('Transfer Click Triggered!'); // 🟢 Debug Line: Console me check karo ye print hota hai ki nahi
    
    if (this.transferForm.invalid) {
      alert("Form inputs are invalid! Please check all mandatory fields.");
      this.transferForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true; 

    // API Payload Mapping matching backend data nodes
    const transferPayload = {
      senderAccountId: Number(this.transferForm.value.senderAccountId),
      receiverAccountId: Number(this.transferForm.value.recipientAccountId),
      amount: Number(this.transferForm.value.transferAmount)
    };

    console.log('Sending secure transfer details:', transferPayload);

    this.transactionService.transfer(transferPayload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        const resString = typeof response === 'string' ? response : JSON.stringify(response);
        
        if (resString && (resString.includes('SUCCESS') || resString.includes('Successful') || resString.includes('successfully'))) {
          alert(`Transaction Successful! Amount ₹${transferPayload.amount} securely moved.`);
          this.transferForm.reset();
        } else {
          alert(typeof response === 'string' ? response : 'Transaction processed successfully.');
          this.transferForm.reset();
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('Network or transactional fault:', error);
        const errorMsg = error.error || error.message || 'Server connection error. Failed to execute transfer.';
        alert(errorMsg);
      }
    });
  }
}


