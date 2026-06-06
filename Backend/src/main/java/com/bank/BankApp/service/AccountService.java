package com.bank.BankApp.service;


import java.util.Random;
import org.springframework.stereotype.Service;
import com.bank.BankApp.DTO.CreateAccountRequest;
import com.bank.BankApp.entity.Account;
import com.bank.BankApp.entity.User;
import com.bank.BankApp.repository.AccountRepository;
import com.bank.BankApp.repository.UserRepository;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(
            AccountRepository accountRepository,
            UserRepository userRepository) {

        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public Account createAccount(
            CreateAccountRequest request) {

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"));

        String accountNumber =
                "ACC" + (100000 + new Random().nextInt(900000));

        Account account = new Account(
                accountNumber,
                request.getInitialBalance(),
                user);

        return accountRepository.save(account);
    }

    public Account getAccount(Long id) {

        return accountRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Account not found"));
    }

    public Double getBalance(Long id) {

        Account account = getAccount(id);

        return account.getBalance();
    }
}

