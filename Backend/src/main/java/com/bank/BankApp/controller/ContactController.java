//package com.bank.BankApp.controller;
//
//
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import com.bank.BankApp.entity.ContactMessage;
//import com.bank.BankApp.repository.ContactRepository;
//
//@RestController
//@RequestMapping("/api/contact")
//@CrossOrigin(origins = "http://localhost:4200")
//public class ContactController {
//
//    private final ContactRepository repository;
//
//    public ContactController(ContactRepository repository) {
//        this.repository = repository;
//    }
//
//    @PostMapping
//    public String saveMessage(
//            @RequestBody ContactMessage message) {
//
//        repository.save(message);
//        return "Message Sent Successfully";
//    }
//}
//
//
