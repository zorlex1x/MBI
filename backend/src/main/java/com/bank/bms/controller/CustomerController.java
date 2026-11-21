package com.bank.bms.controller;

import com.bank.bms.dto.*;
import com.bank.bms.model.Beneficiary;
import com.bank.bms.model.Transaction;
import com.bank.bms.service.BankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final BankingService bankingService;

    public CustomerController(BankingService bankingService) {
        this.bankingService = bankingService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(@RequestHeader("X-User-Id") String userId) {
        try {
            Map<String, Object> data = bankingService.getCustomerDashboard(userId);
            return ResponseEntity.ok(ApiResponse.ok(data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/lookup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> lookup(@RequestParam String accountNumber) {
        try {
            Map<String, Object> data = bankingService.lookupAccount(accountNumber);
            return ResponseEntity.ok(ApiResponse.ok(data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<Transaction>> transfer(@RequestBody TransferRequest req,
                                                             @RequestHeader("X-User-Id") String userId) {
        try {
            Transaction txn = bankingService.executeTransfer(req, userId);
            return ResponseEntity.ok(ApiResponse.ok("Fund transfer completed successfully.", txn));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactions(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<Transaction> txns = bankingService.getCustomerTransactions(userId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.ok(txns));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/beneficiaries")
    public ResponseEntity<ApiResponse<List<Beneficiary>>> getBeneficiaries(@RequestHeader("X-User-Id") String userId) {
        try {
            List<Beneficiary> list = bankingService.getBeneficiaries(userId);
            return ResponseEntity.ok(ApiResponse.ok(list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/beneficiaries")
    public ResponseEntity<ApiResponse<Beneficiary>> addBeneficiary(@RequestBody BeneficiaryRequest req,
                                                                   @RequestHeader("X-User-Id") String userId) {
        try {
            Beneficiary b = bankingService.addBeneficiary(req, userId);
            return ResponseEntity.ok(ApiResponse.ok("Beneficiary added successfully.", b));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/beneficiaries/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBeneficiary(@PathVariable Long id,
                                                               @RequestHeader("X-User-Id") String userId) {
        try {
            bankingService.deleteBeneficiary(id, userId);
            return ResponseEntity.ok(ApiResponse.ok("Beneficiary deleted successfully.", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/card/toggle-freeze")
    public ResponseEntity<ApiResponse<Boolean>> toggleCardFreeze(@RequestBody Map<String, String> body,
                                                                 @RequestHeader("X-User-Id") String userId) {
        try {
            String mpin = body.get("mpin");
            boolean status = bankingService.toggleCardFreeze(userId, mpin);
            String msg = status ? "Debit card is active and unlocked." : "Debit card has been temporarily locked/frozen.";
            return ResponseEntity.ok(ApiResponse.ok(msg, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/card/request-add-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> requestAddCardOtp(
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            String targetUserId = body.get("userId") != null && !body.get("userId").trim().isEmpty() 
                    ? body.get("userId").trim() 
                    : userId;
            String mpin = body.get("mpin");
            Map<String, String> result = bankingService.requestAddCardOtp(targetUserId, mpin);
            return ResponseEntity.ok(ApiResponse.ok("Verification OTP dispatched to registered mobile.", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/card/add-card")
    public ResponseEntity<ApiResponse<Boolean>> addCard(
            @RequestBody AddCardRequest req,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            boolean success = bankingService.addDebitCard(req, userId);
            return ResponseEntity.ok(ApiResponse.ok("Debit card successfully linked and activated.", success));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/verify-mpin")
    public ResponseEntity<ApiResponse<Boolean>> verifyMpin(@RequestBody Map<String, String> body,
                                                           @RequestHeader("X-User-Id") String userId) {
        try {
            String mpin = body.get("mpin");
            boolean valid = bankingService.verifyMpin(userId, mpin);
            return ResponseEntity.ok(ApiResponse.ok("MPIN verified successfully.", valid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
