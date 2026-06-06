//package com.bank.BankApp.service;
//
//import java.util.List;
//import java.util.stream.Collectors; 
//import org.springframework.stereotype.Service;
//import com.bank.BankApp.DTO.AddMoneyRequest;
//import com.bank.BankApp.DTO.DashboardResponse;
//import com.bank.BankApp.entity.Account;
//import com.bank.BankApp.entity.Transaction;
//import com.bank.BankApp.repository.AccountRepository;
//import com.bank.BankApp.repository.TransactionRepository;
//
//@Service
//public class DashboardService {
//
//    private final AccountRepository accountRepo;
//    private final TransactionRepository transactionRepo;
//
//    public DashboardService(
//            AccountRepository accountRepo,
//            TransactionRepository transactionRepo) {
//        this.accountRepo = accountRepo;
//        this.transactionRepo = transactionRepo;
//    }
//
//    public DashboardResponse getDashboard() {
//
//        Account account = accountRepo.findById(1L)
//                .orElse(new Account(85000.0));
//
//        List<Transaction> transactions = transactionRepo.findAll();
//
//        double totalCredit = transactions.stream()
//                .filter(t -> "CREDIT".equals(t.getType()))
//                .mapToDouble(Transaction::getAmount)
//                .sum();
//
//        double totalDebit = transactions.stream()
//                .filter(t -> "DEBIT".equals(t.getType()))
//                .mapToDouble(Transaction::getAmount)
//                .sum();
//
//        DashboardResponse response = new DashboardResponse();
//
//        response.setTotalBalance(account.getBalance());
//        response.setTotalCredit(totalCredit);
//        response.setTotalDebit(totalDebit);
//
//        // FIX: Replaced .toList() with .collect(Collectors.toList()) for backward compatibility
//        response.setChartData(
//                transactions.stream()
//                        .map(Transaction::getAmount)
//                        .collect(Collectors.toList())
//        );
//
//        return response;
//    }
//
//    public void addMoney(AddMoneyRequest request) {
//
//        Account account = accountRepo.findById(1L)
//                .orElse(new Account(0.0));
//
//        account.setBalance(
//                account.getBalance() + request.getAmount()
//        );
//
//        accountRepo.save(account);
//
//        transactionRepo.save(
//                new Transaction(
//                        request.getAmount(),
//                        "CREDIT"
//                )
//        );
//    }
//}
//
