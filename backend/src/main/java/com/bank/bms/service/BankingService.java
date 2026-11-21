package com.bank.bms.service;

import com.bank.bms.dto.*;
import com.bank.bms.model.*;
import com.bank.bms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class BankingService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final CardRepository cardRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final OtpSessionRepository otpSessionRepository;
    private final AuthService authService;

    public BankingService(UserRepository userRepository,
                          AccountRepository accountRepository,
                          TransactionRepository transactionRepository,
                          CardRepository cardRepository,
                          BeneficiaryRepository beneficiaryRepository,
                          OtpSessionRepository otpSessionRepository,
                          AuthService authService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.cardRepository = cardRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.otpSessionRepository = otpSessionRepository;
        this.authService = authService;
    }

    public Map<String, Object> lookupAccount(String accountNumber) {
        Optional<Account> accOpt = accountRepository.findByAccountNumber(accountNumber.trim());
        Map<String, Object> res = new HashMap<>();
        if (accOpt.isPresent()) {
            Account acc = accOpt.get();
            res.put("exists", true);
            res.put("accountNumber", acc.getAccountNumber());
            res.put("holderName", acc.getUser().getFullName());
            res.put("branchName", acc.getBranchName());
            res.put("ifscCode", acc.getIfscCode());
            res.put("accountType", acc.getAccountType());
            res.put("isInternal", true);
        } else {
            res.put("exists", false);
            res.put("isInternal", false);
        }
        return res;
    }

    @Transactional
    public Transaction executeTransfer(TransferRequest req, String userId) {
        // 1. Validate user and MPIN
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (user.getIsMpinSet() == null || !user.getIsMpinSet() || user.getMpinHash() == null) {
            throw new IllegalStateException("Please set up your 4-digit MPIN before making transactions.");
        }

        if (req.getMpin() == null || req.getMpin().trim().length() != 4) {
            throw new IllegalArgumentException("A valid 4-digit MPIN is required to authorize this transfer.");
        }

        if (!authService.getPasswordEncoder().matches(req.getMpin().trim(), user.getMpinHash())) {
            throw new IllegalArgumentException("Incorrect 4-digit MPIN. Authorization failed.");
        }

        // 2. Validate sender account
        Account fromAccount = accountRepository.findByAccountNumber(req.getFromAccountNumber())
                .orElseThrow(() -> new RuntimeException("Sender account not found: " + req.getFromAccountNumber()));

        if (!fromAccount.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized: Sender account does not belong to logged-in user.");
        }

        if (!"ACTIVE".equalsIgnoreCase(fromAccount.getStatus())) {
            throw new IllegalStateException("Transfer blocked: Your account is currently " + fromAccount.getStatus() + ". Please contact administration.");
        }

        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be greater than zero.");
        }

        if (fromAccount.getBalance().compareTo(req.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient funds. Available balance: ₹" + fromAccount.getBalance());
        }

        if (req.getAmount().compareTo(fromAccount.getDailyLimit()) > 0) {
            throw new IllegalArgumentException("Transfer amount exceeds daily limit of ₹" + fromAccount.getDailyLimit());
        }

        if (fromAccount.getAccountNumber().equals(req.getToAccountNumber())) {
            throw new IllegalArgumentException("Cannot transfer funds to the same account.");
        }

        Random random = new Random();
        String refPrefix = "INTERNAL_TRANSFER".equalsIgnoreCase(req.getTransferType()) ? "TRF" :
                ("NEFT".equalsIgnoreCase(req.getTransferType()) ? "NFT" : "IMP");
        String referenceNo = refPrefix + System.currentTimeMillis() + (100 + random.nextInt(900));

        // 3. Process Transfer
        Transaction txn = new Transaction();
        txn.setReferenceNo(referenceNo);
        txn.setFromAccount(fromAccount);
        txn.setAmount(req.getAmount());
        txn.setTransactionType(req.getTransferType() != null ? req.getTransferType() : "INTERNAL_TRANSFER");
        txn.setStatus("SUCCESS");
        txn.setCreatedAt(LocalDateTime.now());

        // Deduct from sender
        BigDecimal newFromBalance = fromAccount.getBalance().subtract(req.getAmount());
        fromAccount.setBalance(newFromBalance);
        accountRepository.save(fromAccount);
        txn.setBalanceAfterFrom(newFromBalance);

        // Check if internal recipient
        Optional<Account> toAccountOpt = accountRepository.findByAccountNumber(req.getToAccountNumber());
        if (toAccountOpt.isPresent()) {
            Account toAccount = toAccountOpt.get();
            if ("CLOSED".equalsIgnoreCase(toAccount.getStatus())) {
                throw new IllegalStateException("Recipient account is closed.");
            }
            BigDecimal newToBalance = toAccount.getBalance().add(req.getAmount());
            toAccount.setBalance(newToBalance);
            accountRepository.save(toAccount);

            txn.setToAccount(toAccount);
            txn.setBalanceAfterTo(newToBalance);
            String desc = req.getDescription() != null && !req.getDescription().trim().isEmpty()
                    ? req.getDescription()
                    : "Transfer to " + toAccount.getUser().getFullName() + " (" + toAccount.getAccountNumber() + ")";
            txn.setDescription(desc);
        } else {
            // External NEFT / IMPS
            txn.setToAccount(null);
            String desc = req.getDescription() != null && !req.getDescription().trim().isEmpty()
                    ? req.getDescription()
                    : req.getTransferType() + " to " + req.getBeneficiaryName() + " (" + req.getToAccountNumber() + " / " + req.getIfscCode() + ")";
            txn.setDescription(desc);
        }

        return transactionRepository.save(txn);
    }

    public Map<String, Object> getCustomerDashboard(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Account account = accountRepository.findFirstByUser(user)
                .orElseThrow(() -> new RuntimeException("No active bank account found for user: " + userId));

        Card card = cardRepository.findByAccount(account).orElse(null);

        List<Transaction> transactions = transactionRepository.findByAccountOrderByCreatedAtDesc(account);
        List<Transaction> recentTransactions = transactions.size() > 10 ? transactions.subList(0, 10) : transactions;

        Map<String, Object> data = new HashMap<>();
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("userId", user.getUserId());
        userMap.put("fullName", user.getFullName());
        userMap.put("email", user.getEmail());
        userMap.put("mobileNumber", user.getMobileNumber());
        userMap.put("aadhaarMasked", maskAadhaar(user.getAadhaarNumber()));
        userMap.put("panNumber", user.getPanNumber() != null ? user.getPanNumber() : "N/A");
        userMap.put("role", user.getRole());
        userMap.put("status", user.getStatus());
        userMap.put("isMpinSet", user.getIsMpinSet() != null && user.getIsMpinSet());
        userMap.put("dateOfBirth", user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : "");
        userMap.put("birthYear", user.getDateOfBirth() != null ? user.getDateOfBirth().getYear() : null);
        data.put("user", userMap);

        data.put("account", Map.of(
                "accountNumber", account.getAccountNumber(),
                "accountType", account.getAccountType(),
                "ifscCode", account.getIfscCode(),
                "branchName", account.getBranchName(),
                "balance", account.getBalance(),
                "dailyLimit", account.getDailyLimit(),
                "status", account.getStatus()
        ));

        if (card != null) {
            Map<String, Object> cardMap = new HashMap<>();
            cardMap.put("isIssued", true);
            cardMap.put("isLinked", Boolean.TRUE.equals(card.getIsLinked()));
            cardMap.put("cardType", card.getCardType());
            cardMap.put("isActive", card.getIsActive());
            cardMap.put("dailyLimit", card.getDailyLimit());
            String last4 = card.getCardNumber() != null && card.getCardNumber().length() >= 4 
                    ? card.getCardNumber().substring(card.getCardNumber().length() - 4) 
                    : "4591";
            cardMap.put("cardNumberMasked", "•••• •••• •••• " + last4);
            if (Boolean.TRUE.equals(card.getIsLinked())) {
                cardMap.put("cardNumber", card.getCardNumber());
                cardMap.put("cardHolderName", card.getCardHolderName());
                cardMap.put("expiryMonth", card.getExpiryMonth());
                cardMap.put("expiryYear", card.getExpiryYear());
                cardMap.put("cvv", card.getCvv());
            }
            data.put("card", cardMap);
        } else {
            Map<String, Object> cardMap = new HashMap<>();
            cardMap.put("isIssued", false);
            cardMap.put("isLinked", false);
            data.put("card", cardMap);
        }

        data.put("recentTransactions", recentTransactions);
        return data;
    }

    public List<Transaction> getCustomerTransactions(String userId, String startDate, String endDate) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Account account = accountRepository.findFirstByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (startDate != null && !startDate.isEmpty() && endDate != null && !endDate.isEmpty()) {
            LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
            LocalDateTime end = LocalDate.parse(endDate).atTime(LocalTime.MAX);
            return transactionRepository.findByAccountAndDateRange(account, start, end);
        }

        return transactionRepository.findByAccountOrderByCreatedAtDesc(account);
    }

    @Transactional
    public Beneficiary addBeneficiary(BeneficiaryRequest req, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getIsMpinSet() == null || !user.getIsMpinSet() || user.getMpinHash() == null) {
            throw new IllegalStateException("Please set up your MPIN first.");
        }
        if (req.getMpin() == null || !authService.getPasswordEncoder().matches(req.getMpin().trim(), user.getMpinHash())) {
            throw new IllegalArgumentException("Incorrect MPIN. Cannot add beneficiary.");
        }

        Beneficiary b = new Beneficiary();
        b.setUser(user);
        b.setBeneficiaryName(req.getBeneficiaryName());
        b.setBeneficiaryAccountNumber(req.getBeneficiaryAccountNumber());
        b.setIfscCode(req.getIfscCode());
        b.setBankName(req.getBankName() != null ? req.getBankName() : "MBI - Modern Bank Of India");
        b.setNickname(req.getNickname());
        b.setCreatedAt(LocalDateTime.now());
        return beneficiaryRepository.save(b);
    }

    public List<Beneficiary> getBeneficiaries(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return beneficiaryRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public void deleteBeneficiary(Long id, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Beneficiary b = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Beneficiary not found"));
        if (!b.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized action.");
        }
        beneficiaryRepository.delete(b);
    }

    @Transactional
    public boolean toggleCardFreeze(String userId, String mpin) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getIsMpinSet() == null || !user.getIsMpinSet() || user.getMpinHash() == null) {
            throw new IllegalStateException("Please set up your MPIN first.");
        }
        if (mpin == null || !authService.getPasswordEncoder().matches(mpin.trim(), user.getMpinHash())) {
            throw new IllegalArgumentException("Incorrect MPIN.");
        }

        Account account = accountRepository.findFirstByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        Card card = cardRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        card.setIsActive(!card.getIsActive());
        cardRepository.save(card);
        return card.getIsActive();
    }

    public boolean verifyMpin(String userId, String mpin) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        if (user.getMpinHash() == null || !Boolean.TRUE.equals(user.getIsMpinSet())) {
            throw new IllegalStateException("MPIN is not set yet. Please set your 4-digit MPIN first.");
        }
        if (mpin == null || !authService.getPasswordEncoder().matches(mpin.trim(), user.getMpinHash())) {
            throw new IllegalArgumentException("Incorrect 4-digit MPIN. Access denied.");
        }
        return true;
    }

    @Transactional
    public Map<String, String> requestAddCardOtp(String userId, String mpin) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID is required.");
        }
        User user = userRepository.findByUserId(userId.trim())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (user.getIsMpinSet() == null || !user.getIsMpinSet() || user.getMpinHash() == null) {
            throw new IllegalStateException("Please set up your 4-digit MPIN before linking your debit card.");
        }
        if (mpin == null || mpin.trim().length() != 4) {
            throw new IllegalArgumentException("A valid 4-digit MPIN is required.");
        }
        if (!authService.getPasswordEncoder().matches(mpin.trim(), user.getMpinHash())) {
            throw new IllegalArgumentException("Incorrect 4-digit MPIN. Authorization failed.");
        }

        Account account = accountRepository.findFirstByUser(user)
                .orElseThrow(() -> new RuntimeException("No active account found for user: " + userId));

        Card card = cardRepository.findByAccount(account)
                .orElseThrow(() -> new IllegalStateException("No debit card has been issued for your account by the branch administrator."));

        if (Boolean.TRUE.equals(card.getIsLinked())) {
            throw new IllegalStateException("Your debit card is already linked and active.");
        }

        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);
        OtpSession session = new OtpSession();
        session.setUserId(user.getUserId());
        session.setMobileNumber(user.getMobileNumber());
        session.setOtpCode(otp);
        session.setPurpose("ADD_DEBIT_CARD");
        session.setIsVerified(false);
        session.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpSessionRepository.save(session);

        Map<String, String> res = new HashMap<>();
        res.put("otpPreview", otp);
        res.put("mobileMasked", maskMobile(user.getMobileNumber()));
        return res;
    }

    @Transactional
    public boolean addDebitCard(AddCardRequest req, String headerUserId) {
        String targetUserId = req.getUserId() != null && !req.getUserId().trim().isEmpty() 
                ? req.getUserId().trim() 
                : headerUserId;

        if (targetUserId == null || targetUserId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID is required.");
        }

        User user = userRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + targetUserId));

        if (user.getIsMpinSet() == null || !user.getIsMpinSet() || user.getMpinHash() == null) {
            throw new IllegalStateException("Please set up your 4-digit MPIN first.");
        }
        if (req.getMpin() == null || req.getMpin().trim().length() != 4) {
            throw new IllegalArgumentException("A valid 4-digit MPIN is required.");
        }
        if (!authService.getPasswordEncoder().matches(req.getMpin().trim(), user.getMpinHash())) {
            throw new IllegalArgumentException("Incorrect 4-digit MPIN. Card linking failed.");
        }
        if (req.getOtp() == null || req.getOtp().trim().length() != 6) {
            throw new IllegalArgumentException("Valid 6-digit OTP code is required.");
        }

        Optional<OtpSession> sessionOpt = otpSessionRepository
                .findTopByUserIdAndPurposeOrderByCreatedAtDesc(user.getUserId(), "ADD_DEBIT_CARD");

        if (sessionOpt.isEmpty()) {
            throw new IllegalArgumentException("No active OTP request found for linking your card. Please request an OTP first.");
        }

        OtpSession session = sessionOpt.get();
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired. Please request a new OTP.");
        }
        if (!session.getOtpCode().equals(req.getOtp().trim())) {
            throw new IllegalArgumentException("Invalid OTP code. Please enter the correct verification code.");
        }

        session.setIsVerified(true);
        otpSessionRepository.save(session);

        Account account = accountRepository.findFirstByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found for user: " + targetUserId));

        Card card = cardRepository.findByAccount(account)
                .orElseThrow(() -> new IllegalStateException("No debit card has been issued for your account by the branch admin."));

        card.setIsLinked(true);
        card.setIsActive(true);
        card.setLinkedAt(LocalDateTime.now());
        cardRepository.save(card);
        return true;
    }

    private String maskMobile(String mobile) {
        if (mobile == null || mobile.length() < 10) return mobile;
        return mobile.substring(0, 2) + "XXXXXX" + mobile.substring(mobile.length() - 2);
    }

    private String maskAadhaar(String aadhaar) {
        if (aadhaar == null || aadhaar.length() < 12) return aadhaar;
        return "XXXX-XXXX-" + aadhaar.substring(8);
    }
}
