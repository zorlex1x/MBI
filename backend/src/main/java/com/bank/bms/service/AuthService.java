package com.bank.bms.service;

import com.bank.bms.dto.LoginRequest;
import com.bank.bms.dto.LoginResponse;
import com.bank.bms.dto.SetMpinRequest;
import com.bank.bms.dto.VerifyOtpRequest;
import com.bank.bms.model.Account;
import com.bank.bms.model.OtpSession;
import com.bank.bms.model.User;
import com.bank.bms.repository.AccountRepository;
import com.bank.bms.repository.OtpSessionRepository;
import com.bank.bms.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final OtpSessionRepository otpSessionRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository,
                       AccountRepository accountRepository,
                       OtpSessionRepository otpSessionRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.otpSessionRepository = otpSessionRepository;
    }

    public BCryptPasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }

    @Transactional
    public LoginResponse login(LoginRequest req) {
        if (req.getUserId() == null || req.getUserId().trim().isEmpty()) {
            return LoginResponse.failed("User ID or Email is required.");
        }

        String searchId = req.getUserId().trim();
        Optional<User> userOpt = userRepository.findByUserId(searchId);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(searchId);
        }
        if (userOpt.isEmpty()) {
            // Also allow login using 12-digit Account Number
            Optional<Account> accOpt = accountRepository.findByAccountNumber(searchId);
            if (accOpt.isPresent()) {
                userOpt = Optional.of(accOpt.get().getUser());
            }
        }

        if (userOpt.isEmpty()) {
            return LoginResponse.failed("Account not found. Please check your User ID.");
        }

        User user = userOpt.get();

        if ("CLOSED".equalsIgnoreCase(user.getStatus())) {
            return LoginResponse.failed("This user account has been closed. Please contact bank administration.");
        }

        // 1. Quick Login with MPIN (No OTP required)
        if ("MPIN".equalsIgnoreCase(req.getLoginType())) {
            if (req.getMpin() == null || req.getMpin().trim().length() != 4) {
                return LoginResponse.failed("Please enter a valid 4-digit MPIN.");
            }
            if (user.getIsMpinSet() == null || !user.getIsMpinSet() || user.getMpinHash() == null) {
                return LoginResponse.failed("MPIN is not set yet. Please login using User ID and Password to set up your MPIN.");
            }
            if (!passwordEncoder.matches(req.getMpin().trim(), user.getMpinHash())) {
                return LoginResponse.failed("Incorrect 4-digit MPIN.");
            }

            String accNum = "";
            Optional<Account> acc = accountRepository.findFirstByUser(user);
            if (acc.isPresent()) {
                accNum = acc.get().getAccountNumber();
            }
            Integer birthYear = user.getDateOfBirth() != null ? user.getDateOfBirth().getYear() : null;
            return LoginResponse.loggedIn(user.getRole(), user.getUserId(), user.getFullName(), user.getEmail(), accNum, user.getIsMpinSet(), birthYear);
        }

        // 2. Standard Password Login
        if (req.getPassword() == null || req.getPassword().isEmpty()) {
            return LoginResponse.failed("Password is required.");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            return LoginResponse.failed("Invalid password.");
        }

        // Admin can login directly without 2FA OTP
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return LoginResponse.loggedIn("ADMIN", user.getUserId(), user.getFullName(), user.getEmail(), "ADMIN_MASTER", true, null);
        }

        // For Customers: Trigger 2FA OTP verification
        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);
        OtpSession session = new OtpSession();
        session.setUserId(user.getUserId());
        session.setMobileNumber(user.getMobileNumber());
        session.setOtpCode(otp);
        session.setPurpose("LOGIN_2FA");
        session.setIsVerified(false);
        session.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpSessionRepository.save(session);

        String maskedMobile = maskMobile(user.getMobileNumber());
        return LoginResponse.otpRequired(user.getUserId(), maskedMobile, otp, UUID.randomUUID().toString());
    }

    @Transactional
    public LoginResponse verifyOtp(VerifyOtpRequest req) {
        if (req.getUserId() == null || req.getOtpCode() == null) {
            return LoginResponse.failed("User ID and OTP are required.");
        }

        Optional<OtpSession> sessionOpt = otpSessionRepository
                .findTopByUserIdAndPurposeOrderByCreatedAtDesc(req.getUserId(), req.getPurpose() != null ? req.getPurpose() : "LOGIN_2FA");

        if (sessionOpt.isEmpty()) {
            return LoginResponse.failed("No active OTP request found. Please request a new OTP.");
        }

        OtpSession session = sessionOpt.get();
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            return LoginResponse.failed("OTP has expired. Please request a new one.");
        }

        if (!session.getOtpCode().equals(req.getOtpCode().trim())) {
            return LoginResponse.failed("Invalid OTP code. Please enter the correct 6-digit code.");
        }

        session.setIsVerified(true);
        otpSessionRepository.save(session);

        User user = userRepository.findByUserId(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accNum = "";
        Optional<Account> acc = accountRepository.findFirstByUser(user);
        if (acc.isPresent()) {
            accNum = acc.get().getAccountNumber();
        }

        Integer birthYear = user.getDateOfBirth() != null ? user.getDateOfBirth().getYear() : null;
        return LoginResponse.loggedIn(user.getRole(), user.getUserId(), user.getFullName(), user.getEmail(), accNum, user.getIsMpinSet(), birthYear);
    }

    public void validateMpinRules(User user, String mpin, String confirmMpin) {
        if (mpin == null || confirmMpin == null) {
            throw new IllegalArgumentException("MPIN and Confirm MPIN are required.");
        }
        String cleanMpin = mpin.trim();
        if (!cleanMpin.matches("\\d{4}")) {
            throw new IllegalArgumentException("MPIN must be exactly 4 digits.");
        }
        if (!cleanMpin.equals(confirmMpin.trim())) {
            throw new IllegalArgumentException("MPIN and Confirm MPIN do not match.");
        }
        if ("1234".equals(cleanMpin)) {
            throw new IllegalArgumentException("MPIN cannot be '1234'.");
        }
        if (cleanMpin.charAt(0) == cleanMpin.charAt(1) &&
            cleanMpin.charAt(1) == cleanMpin.charAt(2) &&
            cleanMpin.charAt(2) == cleanMpin.charAt(3)) {
            throw new IllegalArgumentException("MPIN cannot consist of four identical digits (e.g. 1111, 2222).");
        }
        if (user.getDateOfBirth() != null) {
            String birthYear = String.valueOf(user.getDateOfBirth().getYear());
            if (birthYear.equals(cleanMpin)) {
                throw new IllegalArgumentException("MPIN cannot be your birth year (" + birthYear + ").");
            }
        }
    }

    @Transactional
    public Map<String, String> requestMpinOtp(SetMpinRequest req) {
        if (req.getUserId() == null || req.getUserId().trim().isEmpty()) {
            throw new IllegalArgumentException("User ID is required.");
        }
        User user = userRepository.findByUserId(req.getUserId().trim())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + req.getUserId()));

        validateMpinRules(user, req.getMpin(), req.getConfirmMpin());

        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);
        OtpSession session = new OtpSession();
        session.setUserId(user.getUserId());
        session.setMobileNumber(user.getMobileNumber());
        session.setOtpCode(otp);
        session.setPurpose("SET_MPIN");
        session.setIsVerified(false);
        session.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpSessionRepository.save(session);

        Map<String, String> result = new HashMap<>();
        result.put("otpPreview", otp);
        result.put("mobileMasked", maskMobile(user.getMobileNumber()));
        if (user.getDateOfBirth() != null) {
            result.put("birthYear", String.valueOf(user.getDateOfBirth().getYear()));
        }
        return result;
    }

    @Transactional
    public boolean setMpin(SetMpinRequest req) {
        if (req.getUserId() == null || req.getUserId().trim().isEmpty()) {
            throw new IllegalArgumentException("User ID is required.");
        }
        User user = userRepository.findByUserId(req.getUserId().trim())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + req.getUserId()));

        validateMpinRules(user, req.getMpin(), req.getConfirmMpin());

        if (req.getOtpCode() == null || req.getOtpCode().trim().isEmpty()) {
            throw new IllegalArgumentException("OTP verification code is required.");
        }

        Optional<OtpSession> sessionOpt = otpSessionRepository
                .findTopByUserIdAndPurposeOrderByCreatedAtDesc(user.getUserId(), "SET_MPIN");

        if (sessionOpt.isEmpty()) {
            throw new IllegalArgumentException("No active OTP request found for MPIN setup. Please request a new OTP.");
        }

        OtpSession session = sessionOpt.get();
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired. Please request a new OTP.");
        }

        if (!session.getOtpCode().equals(req.getOtpCode().trim())) {
            throw new IllegalArgumentException("Invalid OTP code. Please enter the correct verification code.");
        }

        session.setIsVerified(true);
        otpSessionRepository.save(session);

        user.setMpinHash(passwordEncoder.encode(req.getMpin().trim()));
        user.setIsMpinSet(true);
        userRepository.save(user);
        return true;
    }

    @Transactional
    public String generateAadhaarOtp(String aadhaarNumber, String mobileNumber) {
        String cleanAadhaar = aadhaarNumber.replaceAll("\\s+", "");
        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);

        OtpSession session = new OtpSession();
        session.setUserId(cleanAadhaar);
        session.setMobileNumber(mobileNumber);
        session.setOtpCode(otp);
        session.setPurpose("AADHAAR_KYC");
        session.setIsVerified(false);
        session.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpSessionRepository.save(session);

        return otp;
    }

    @Transactional
    public boolean verifyAadhaarOtp(String aadhaarNumber, String otpCode) {
        String cleanAadhaar = aadhaarNumber.replaceAll("\\s+", "");
        Optional<OtpSession> sessionOpt = otpSessionRepository
                .findTopByUserIdAndPurposeOrderByCreatedAtDesc(cleanAadhaar, "AADHAAR_KYC");

        if (sessionOpt.isEmpty()) {
            return false;
        }
        OtpSession session = sessionOpt.get();
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }
        if (session.getOtpCode().equals(otpCode.trim())) {
            session.setIsVerified(true);
            otpSessionRepository.save(session);
            return true;
        }
        return false;
    }

    private String maskMobile(String mobile) {
        if (mobile == null || mobile.length() < 5) return "******" + mobile;
        int len = mobile.length();
        return "******" + mobile.substring(len - 4);
    }
}
