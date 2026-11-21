package com.bank.bms.controller;

import com.bank.bms.dto.*;
import com.bank.bms.model.Account;
import com.bank.bms.model.Card;
import com.bank.bms.model.Transaction;
import com.bank.bms.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/accounts/create")
    public ResponseEntity<CustomerWelcomeResponse> createCustomer(@RequestBody CreateCustomerRequest req,
                                                                   @RequestHeader(value = "X-Admin-User", defaultValue = "admin") String adminUser) {
        try {
            CustomerWelcomeResponse resp = adminService.createCustomerAccount(req, adminUser);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            CustomerWelcomeResponse err = new CustomerWelcomeResponse();
            err.setSuccess(false);
            err.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<List<Account>>> getAllAccounts() {
        try {
            List<Account> accounts = adminService.getAllAccounts();
            return ResponseEntity.ok(ApiResponse.ok(accounts));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/accounts/{accountNumber}/status")
    public ResponseEntity<ApiResponse<Boolean>> updateStatus(@PathVariable String accountNumber,
                                                             @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            boolean res = adminService.updateAccountStatus(accountNumber, status);
            return ResponseEntity.ok(ApiResponse.ok("Account status updated to " + status, res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/accounts/{accountNumber}/issue-card")
    public ResponseEntity<ApiResponse<Card>> issueDebitCard(@PathVariable String accountNumber,
                                                            @RequestBody(required = false) Map<String, String> body,
                                                            @RequestHeader(value = "X-Admin-User", defaultValue = "admin") String adminUser) {
        try {
            String cardType = (body != null && body.containsKey("cardType")) ? body.get("cardType") : "RUPAY";
            Card card = adminService.issueDebitCard(accountNumber, cardType, adminUser);
            return ResponseEntity.ok(ApiResponse.ok("Debit card (" + card.getCardType() + ") successfully issued for account " + accountNumber, card));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/accounts/deposit")
    public ResponseEntity<ApiResponse<Transaction>> cashDeposit(@RequestBody DepositWithdrawRequest req,
                                                                 @RequestHeader(value = "X-Admin-User", defaultValue = "admin") String adminUser) {
        try {
            Transaction txn = adminService.branchCashDeposit(req, adminUser);
            return ResponseEntity.ok(ApiResponse.ok("Cash deposited successfully. Balance updated.", txn));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/accounts/withdraw")
    public ResponseEntity<ApiResponse<Transaction>> cashWithdrawal(@RequestBody DepositWithdrawRequest req,
                                                                    @RequestHeader(value = "X-Admin-User", defaultValue = "admin") String adminUser) {
        try {
            Transaction txn = adminService.branchCashWithdrawal(req, adminUser);
            return ResponseEntity.ok(ApiResponse.ok("Cash dispensed successfully. Balance updated.", txn));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        try {
            Map<String, Object> stats = adminService.getAdminStats();
            return ResponseEntity.ok(ApiResponse.ok(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<Transaction>>> getGlobalLedger() {
        try {
            List<Transaction> txns = adminService.getGlobalLedger();
            return ResponseEntity.ok(ApiResponse.ok(txns));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
