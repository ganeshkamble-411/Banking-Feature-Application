package com.bank.BankApp.controller;

import org.springframework.web.bind.annotation.*;
import com.bank.BankApp.DTO.CreateAccountRequest;
import com.bank.BankApp.entity.Account;
import com.bank.BankApp.service.AccountService;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:4200")
public class AccountController {

    private final AccountService accountService;

    public AccountController(
            AccountService accountService) {

        this.accountService = accountService;
    }

    @PostMapping("/create")
    public Account createAccount(
            @RequestBody CreateAccountRequest request) {

        return accountService.createAccount(
                request);
    }

    @GetMapping("/{id}")
    public Account getAccount(
            @PathVariable Long id) {

        return accountService.getAccount(id);
    }

    @GetMapping("/balance/{id}")
    public Double getBalance(
            @PathVariable Long id) {

        return accountService.getBalance(id);
    }
}


