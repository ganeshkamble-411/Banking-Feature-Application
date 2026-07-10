import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// 🔷 Import your Transaction Service
import { TransactionService } from '../../services/transaction.service'; // Apne sahi folder path ke hisab se import set kar lena

// 🔷 IBM Carbon Web Components Registry Imports
import '@carbon/web-components/es/components/ui-shell/index.js';
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/form/index.js';
import '@carbon/web-components/es/components/stack/index.js';
import '@carbon/web-components/es/components/grid/index.js';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class TransferComponent implements OnInit {
  transferForm!: FormGroup;
  isSubmitting = false; 

  // 🔷 FIXED: Direct TransactionService ko inject kiya hai ab yahan
  constructor(private fb: FormBuilder, private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      senderAccountId: ['', [Validators.required]],
      recipientAccountId: ['', [Validators.required]],
      transferAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onTransferSubmit(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true; 

    const transferPayload = {
      senderAccountId: this.transferForm.value.senderAccountId,
      recipientAccountId: this.transferForm.value.recipientAccountId,
      amount: Number(this.transferForm.value.transferAmount),
      timestamp: new Date().toISOString()
    };

    console.log('Sending secure transfer details:', transferPayload);

    // 🚀 FIXED: Ab tumhari service ka transfer pipeline hit hoga jo text response handle karega
    this.transactionService.transfer(transferPayload).subscribe({
      next: (response: string) => {
        this.isSubmitting = false;
        
        // Kyunki backend se text type response aa sakta hai ('text' responseType in service)
        if (response && (response.includes('SUCCESS') || response.includes('Successful') || response.includes('successfully'))) {
          alert(`Transaction Successful! Amount ₹${transferPayload.amount} securely moved.`);
          this.transferForm.reset();
        } else {
          // Agar direct message hi string form me return hua ho
          alert(response || 'Transaction processed successfully.');
          this.transferForm.reset();
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('Network or transactional fault:', error);
        
        // Agar response string directly error me aati hai ya fir error object me message hai
        const errorMsg = error.error || error.message || 'Server connection error. Failed to execute transfer.';
        alert(errorMsg);
      }
    });
  }
}

