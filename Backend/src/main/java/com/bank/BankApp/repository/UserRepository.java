package com.bank.BankApp.repository;


import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bank.BankApp.entity.User;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}