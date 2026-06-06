package com.bank.BankApp.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import com.bank.BankApp.DTO.LoginRequest;
import com.bank.BankApp.DTO.RegisterRequest;
import com.bank.BankApp.entity.User;
import com.bank.BankApp.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    public String register(
    		RegisterRequest request) {

        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            return "Email already exists";
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPassword());

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public String login(
            LoginRequest request) {

        Optional<User> user =
                userRepository.findByEmail(
           request.getEmail());

        if (user.isPresent()
                && user.get()
                        .getPassword()
                        .equals(
                                request.getPassword())) {

            return "Login Successful";
        }

        return "Invalid Credentials";
    }
}

