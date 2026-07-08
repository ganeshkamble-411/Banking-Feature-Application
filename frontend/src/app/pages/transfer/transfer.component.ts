import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// 🔷 IBM Carbon Web Components Registry Imports
import '@carbon/web-components/es/components/ui-shell/index.js';
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/text-input/index.js';
import '@carbon/web-components/es/components/number-input/index.js';
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
  isSubmitting = false; // Transaction status tracker loader flag
  private baseUrl = 'http://localhost:8080/api/auth'; // Tumhara backend URL base

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Form control bindings initializing
    this.transferForm = this.fb.group({
      senderAccountId: ['', [Validators.required]],
      recipientAccountId: ['', [Validators.required]],
      transferAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // 🚀 Form Trigger API Submit pipeline
  onTransferSubmit(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true; // Lock button interaction

    // Backend object data mapping
    const transferPayload = {
      senderAccountId: this.transferForm.value.senderAccountId,
      recipientAccountId: this.transferForm.value.recipientAccountId,
      amount: Number(this.transferForm.value.transferAmount),
      timestamp: new Date().toISOString()
    };

    console.log('Sending secure transfer details:', transferPayload);

    // API Post Trigger
    this.http.post(`${this.baseUrl}/transfer`, transferPayload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response && (response.status === 'SUCCESS' || response.message?.includes('Successful'))) {
          alert(`Transaction Successful! Amount ₹${transferPayload.amount} securely moved.`);
          this.transferForm.reset();
        } else {
          alert(response.message || 'Transaction processing failed on host system.');
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('Network or transactional fault:', error);
        alert(error.error?.message || 'Server connection error. Failed to execute transfer.');
      }
    });
  }
}