package com.bank.BankApp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;

    private Double balance;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Account() {
    }

    public Account(String accountNumber,
                   Double balance,
                   User user) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(
            String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(
            Double balance) {
        this.balance = balance;
    }

    public User getUser() {
        return user;
    }

    public void setUser(
            User user) {
        this.user = user;
    }
}


