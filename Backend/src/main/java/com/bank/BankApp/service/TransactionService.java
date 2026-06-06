package com.bank.BankApp.service;

import org.springframework.stereotype.Service;
import com.bank.BankApp.DTO.DepositRequest;
import com.bank.BankApp.DTO.TransferRequest;
import com.bank.BankApp.DTO.WithdrawRequest;
import com.bank.BankApp.entity.Account;
import com.bank.BankApp.entity.Transaction;
import com.bank.BankApp.repository.AccountRepository;
import com.bank.BankApp.repository.TransactionRepository;
import java.util.List;

@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    public String deposit(
            DepositRequest request) {

        Account account =
                accountRepository.findById(
                        request.getAccountId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Account not found"));

        account.setBalance(
                account.getBalance()
                        + request.getAmount());

        accountRepository.save(account);

        Transaction transaction =
                new Transaction(
                        "DEPOSIT",
                        request.getAmount(),
                        "SUCCESS",
                        account);

        transactionRepository.save(transaction);

        return "Money Deposited Successfully";
    }

    public String withdraw(
            WithdrawRequest request) {

        Account account =
                accountRepository.findById(
                        request.getAccountId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Account not found"));

        if (account.getBalance()
                < request.getAmount()) {

            return "Insufficient Balance";
        }

        account.setBalance(
                account.getBalance()
                        - request.getAmount());

        accountRepository.save(account);

        Transaction transaction =
                new Transaction(
                        "WITHDRAW",
                        request.getAmount(),
                        "SUCCESS",
                        account);

        transactionRepository.save(transaction);

        return "Money Withdrawn Successfully";
    }
    
    public String transfer(
            TransferRequest request) {

        Account sender =
                accountRepository.findById(
                        request.getSenderAccountId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Sender Account Not Found"));

        Account receiver =
                accountRepository.findById(
                        request.getReceiverAccountId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Receiver Account Not Found"));

        if (sender.getBalance() < request.getAmount()) {
            return "Insufficient Balance";
        }

        sender.setBalance(
                sender.getBalance()
                        - request.getAmount());

        receiver.setBalance(
                receiver.getBalance()
                        + request.getAmount());

        accountRepository.save(sender);
        accountRepository.save(receiver);

        Transaction senderTxn =
                new Transaction(
                        "TRANSFER_DEBIT",
                        request.getAmount(),
                        "SUCCESS",
                        sender);

        Transaction receiverTxn =
                new Transaction(
                        "TRANSFER_CREDIT",
                        request.getAmount(),
                        "SUCCESS",
                        receiver);

        transactionRepository.save(senderTxn);
        transactionRepository.save(receiverTxn);

        return "Money Transferred Successfully";
    }
    
    public List<Transaction> getHistory(
            Long accountId) {

        return transactionRepository
                .findByAccountId(accountId);
    }
}



