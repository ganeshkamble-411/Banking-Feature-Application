package com.bank.BankApp.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bank.BankApp.entity.Transaction;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountId(Long accountId);
}