package com.bank.BankApp.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.bank.BankApp.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
	
}

