package com.bank.BankApp.controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bank.BankApp.DTO.DepositRequest;
import com.bank.BankApp.DTO.TransferRequest;
import com.bank.BankApp.DTO.WithdrawRequest;
import com.bank.BankApp.entity.Transaction;
import com.bank.BankApp.service.TransactionService;

@RestController
@RequestMapping("/api/transaction")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public String deposit(
            @RequestBody DepositRequest request) {

        return transactionService.deposit(request);
    }

    @PostMapping("/withdraw")
    public String withdraw(
            @RequestBody WithdrawRequest request) {

        return transactionService.withdraw(request);
    }

    @PostMapping("/transfer")
    public String transfer(
            @RequestBody TransferRequest request) {

        return transactionService.transfer(request);
    }

    @GetMapping("/history/{accountId}")
    public List<Transaction> history(
            @PathVariable Long accountId) {

        return transactionService.getHistory(accountId);
    }
}

