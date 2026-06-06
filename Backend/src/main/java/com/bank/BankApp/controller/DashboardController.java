//package com.bank.BankApp.controller;
//
//
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import com.bank.BankApp.DTO.AddMoneyRequest;
//import com.bank.BankApp.DTO.DashboardResponse;
//import com.bank.BankApp.service.DashboardService;
//
//@RestController
//@RequestMapping("/api/dashboard")
//@CrossOrigin(origins = "http://localhost:4200")
//public class DashboardController {
//
//    private final DashboardService dashboardService;
//
//    public DashboardController(
//            DashboardService dashboardService) {
//
//        this.dashboardService = dashboardService;
//    }
//
//    @GetMapping
//    public DashboardResponse getDashboard() {
//        return dashboardService.getDashboard();
//    }
//
//    @PostMapping("/add-money")
//    public String addMoney(
//            @RequestBody AddMoneyRequest request) {
//
//        dashboardService.addMoney(request);
//
//        return "Money Added Successfully";
//    }
//}
//
//
//
//
