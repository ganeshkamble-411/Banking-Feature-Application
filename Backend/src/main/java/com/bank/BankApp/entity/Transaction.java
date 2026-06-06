package com.bank.BankApp.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private Double amount;

    private String status;

    private LocalDateTime transactionDate;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    public Transaction() {
    }

    public Transaction(String type,
                       Double amount,
                       String status,
                       Account account) {

        this.type = type;
        this.amount = amount;
        this.status = status;
        this.account = account;
        this.transactionDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public Double getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public Account getAccount() {
        return account;
    }
}





