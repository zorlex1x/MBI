package com.bank.bms.controller;

import com.bank.bms.dto.*;
import com.bank.bms.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        try {
            LoginResponse resp = authService.login(req);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(LoginResponse.failed(e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponse> verifyOtp(@RequestBody VerifyOtpRequest req) {
        try {
            LoginResponse resp = authService.verifyOtp(req);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(LoginResponse.failed(e.getMessage()));
        }
    }

    @PostMapping("/request-mpin-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> requestMpinOtp(@RequestBody SetMpinRequest req) {
        try {
            Map<String, String> data = authService.requestMpinOtp(req);
            return ResponseEntity.ok(ApiResponse.ok("Verification OTP sent to registered mobile.", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/set-mpin")
    public ResponseEntity<ApiResponse<Boolean>> setMpin(@RequestBody SetMpinRequest req) {
        try {
            boolean success = authService.setMpin(req);
            return ResponseEntity.ok(ApiResponse.ok("4-digit MPIN created successfully! You can now use this MPIN for quick logins and transaction authorizations.", success));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/aadhaar-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> generateAadhaarOtp(@RequestBody Map<String, String> body) {
        try {
            String aadhaar = body.get("aadhaarNumber");
            String mobile = body.get("mobileNumber");
            if (aadhaar == null || mobile == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Aadhaar Number and Mobile Number are required."));
            }
            String otp = authService.generateAadhaarOtp(aadhaar, mobile);
            return ResponseEntity.ok(ApiResponse.ok("Aadhaar verification OTP sent to registered mobile.", Map.of("otpPreview", otp)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
