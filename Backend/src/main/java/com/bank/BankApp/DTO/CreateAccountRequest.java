package com.bank.BankApp.DTO;


public class CreateAccountRequest {

    private Long userId;
    private Double initialBalance;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getInitialBalance() {
        return initialBalance;
    }

    public void setInitialBalance(
            Double initialBalance) {
        this.initialBalance = initialBalance;
    }
}