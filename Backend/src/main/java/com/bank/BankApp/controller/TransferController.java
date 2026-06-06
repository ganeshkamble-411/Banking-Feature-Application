//package com.bank.BankApp.controller;
//
//
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import com.bank.BankApp.entity.Transaction;
//import com.bank.BankApp.repository.TransactionRepository;
//
//@RestController
//@RequestMapping("/api/transfer")
//@CrossOrigin(origins = "http://localhost:4200")
//public class TransferController {
//
//    private final TransactionRepository repository;
//
//    public TransferController(TransactionRepository repository) {
//        this.repository = repository;
//    }
//
//    @PostMapping
//    public String transfer(
//            @RequestBody Transaction transaction) {
//
//        transaction.setStatus("Success");
//
//        repository.save(transaction);
//
//        return "Money Transferred Successfully";
//    }
//}
//
//
//
