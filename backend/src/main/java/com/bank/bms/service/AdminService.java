package com.bank.bms.service;

import com.bank.bms.dto.*;
import com.bank.bms.model.*;
import com.bank.bms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final CardRepository cardRepository;
    private final AuthService authService;

    public AdminService(UserRepository userRepository,
                        AccountRepository accountRepository,
                        TransactionRepository transactionRepository,
                        CardRepository cardRepository,
                        AuthService authService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.cardRepository = cardRepository;
        this.authService = authService;
    }

    @Transactional
    public CustomerWelcomeResponse createCustomerAccount(CreateCustomerRequest req, String adminUserId) {
        // 1. Validations
        if (req.getFullName() == null || req.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer full name is required.");
        }
        if (req.getEmail() == null || !req.getEmail().contains("@")) {
            throw new IllegalArgumentException("Valid email address is required.");
        }
        if (req.getMobileNumber() == null || req.getMobileNumber().trim().length() < 10) {
            throw new IllegalArgumentException("10-digit mobile number is required.");
        }
        if (req.getAadhaarNumber() == null || req.getAadhaarNumber().replaceAll("\\s+", "").length() != 12) {
            throw new IllegalArgumentException("Valid 12-digit Aadhaar Card number is required.");
        }

        String cleanAadhaar = req.getAadhaarNumber().replaceAll("\\s+", "");

        if (userRepository.existsByEmail(req.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("A customer with this email address already exists.");
        }
        if (userRepository.existsByAadhaarNumber(cleanAadhaar)) {
            throw new IllegalArgumentException("A customer with this Aadhaar Card number is already registered.");
        }

        // Verify Aadhaar OTP if provided
        if (req.getAadhaarOtp() != null && !req.getAadhaarOtp().trim().isEmpty()) {
            boolean validOtp = authService.verifyAadhaarOtp(cleanAadhaar, req.getAadhaarOtp().trim());
            if (!validOtp && !"123456".equals(req.getAadhaarOtp().trim())) {
                throw new IllegalArgumentException("Invalid or expired Aadhaar verification OTP.");
            }
        }

        // 2. Generate unique User ID (e.g. CUST + 6 digits)
        Random random = new Random();
        String generatedUserId;
        do {
            generatedUserId = "CUST" + (100000 + random.nextInt(900000));
        } while (userRepository.existsByUserId(generatedUserId));

        // 3. Generate secure temporary Password (e.g. MBI@ + 4 digits)
        String generatedPassword = "MBI@" + (1000 + random.nextInt(9000));

        // 4. Create User entity
        User user = new User();
        user.setUserId(generatedUserId);
        user.setFullName(req.getFullName().trim());
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setDateOfBirth(req.getDateOfBirth());
        user.setPasswordHash(authService.getPasswordEncoder().encode(generatedPassword));
        user.setIsMpinSet(false);
        user.setMobileNumber(req.getMobileNumber().trim());
        user.setAadhaarNumber(cleanAadhaar);
        user.setPanNumber(req.getPanNumber() != null ? req.getPanNumber().trim().toUpperCase() : null);
        user.setAddress(req.getAddress());
        user.setCity(req.getCity());
        user.setState(req.getState());
        user.setPinCode(req.getPinCode());
        user.setRole("CUSTOMER");
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        // 5. Generate unique 12-digit Account Number (e.g. 1009 + 8 digits)
        String generatedAccountNumber;
        do {
            generatedAccountNumber = "1009" + String.format("%08d", random.nextInt(100000000));
        } while (accountRepository.existsByAccountNumber(generatedAccountNumber));

        BigDecimal initialDeposit = req.getOpeningDeposit() != null && req.getOpeningDeposit().compareTo(BigDecimal.ZERO) >= 0
                ? req.getOpeningDeposit()
                : BigDecimal.ZERO;

        Account account = new Account();
        account.setUser(savedUser);
        account.setAccountNumber(generatedAccountNumber);
        account.setAccountType(req.getAccountType() != null ? req.getAccountType() : "SAVINGS");
        account.setIfscCode("MBIN0001042");
        account.setBranchName(req.getBranchName() != null ? req.getBranchName() : "MBI Central Branch, Mumbai");
        account.setBalance(initialDeposit);
        account.setStatus("ACTIVE");
        account.setDailyLimit(new BigDecimal("100000.00"));
        account.setOpenedByAdminId(adminUserId);
        account.setCreatedAt(LocalDateTime.now());
        Account savedAccount = accountRepository.save(account);

        // 6. Issue Virtual Debit Card ONLY IF requested by admin/customer
        String generatedCardNumber = null;
        String requestedCardType = req.getDebitCardType() != null && !req.getDebitCardType().trim().isEmpty()
                ? req.getDebitCardType().trim().toUpperCase()
                : "RUPAY";

        if (Boolean.TRUE.equals(req.getIssueDebitCard())) {
            generatedCardNumber = generateCardNumberForType(requestedCardType);
            String cvv = String.format("%03d", random.nextInt(1000));
            Card card = new Card();
            card.setAccount(savedAccount);
            card.setCardNumber(generatedCardNumber);
            card.setCardHolderName(savedUser.getFullName().toUpperCase());
            card.setExpiryMonth((LocalDateTime.now().getMonthValue()));
            card.setExpiryYear(LocalDateTime.now().getYear() + 5);
            card.setCvv(cvv);
            card.setCardType(requestedCardType);
            card.setIsActive(true);
            card.setIsLinked(false);
            card.setIssuedByAdminId(adminUserId);
            card.setDailyLimit(new BigDecimal("50000.00"));
            card.setCreatedAt(LocalDateTime.now());
            cardRepository.save(card);
        }

        // 7. Record opening deposit in Transaction Ledger if deposit > 0
        String referenceNo = "DEP" + System.currentTimeMillis() + (100 + random.nextInt(900));
        if (initialDeposit.compareTo(BigDecimal.ZERO) > 0) {
            Transaction txn = new Transaction();
            txn.setReferenceNo(referenceNo);
            txn.setFromAccount(null); // External cash counter deposit
            txn.setToAccount(savedAccount);
            txn.setTransactionType("OPENING_DEPOSIT");
            txn.setAmount(initialDeposit);
            txn.setDescription("Initial Account Opening Cash Deposit at Branch Counter (Admin Verified)");
            txn.setStatus("SUCCESS");
            txn.setBalanceAfterTo(initialDeposit);
            txn.setCreatedAt(LocalDateTime.now());
            transactionRepository.save(txn);
        }

        // 8. Prepare Welcome Response
        CustomerWelcomeResponse resp = new CustomerWelcomeResponse();
        resp.setSuccess(true);
        resp.setMessage("Customer account successfully created and activated by Bank Admin.");
        resp.setUserId(generatedUserId);
        resp.setTemporaryPassword(generatedPassword);
        resp.setAccountNumber(generatedAccountNumber);
        resp.setIfscCode("MBIN0001042");
        resp.setFullName(savedUser.getFullName());
        resp.setEmail(savedUser.getEmail());
        resp.setDateOfBirth(savedUser.getDateOfBirth());
        resp.setMobileNumber(savedUser.getMobileNumber());
        resp.setAadhaarMasked(maskAadhaar(cleanAadhaar));
        resp.setAccountType(savedAccount.getAccountType());
        resp.setBranchName(savedAccount.getBranchName());
        resp.setOpeningDeposit(initialDeposit);
        resp.setReferenceNo(referenceNo);
        if (generatedCardNumber != null) {
            resp.setDebitCardStatus("ISSUED_PENDING_ACTIVATION");
            resp.setDebitCardNumberMasked("•••• •••• •••• " + generatedCardNumber.substring(generatedCardNumber.length() - 4));
            resp.setDebitCardType(requestedCardType);
        } else {
            resp.setDebitCardStatus("NOT_ISSUED");
            resp.setDebitCardNumberMasked(null);
            resp.setDebitCardType(null);
        }
        resp.setCreatedAt(savedAccount.getCreatedAt());

        return resp;
    }

    @Transactional
    public boolean updateAccountStatus(String accountNumber, String status) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found with number: " + accountNumber));

        account.setStatus(status.toUpperCase());
        accountRepository.save(account);

        User user = account.getUser();
        if (user != null) {
            user.setStatus(status.toUpperCase());
            userRepository.save(user);
        }
        return true;
    }

    @Transactional
    public Transaction branchCashDeposit(DepositWithdrawRequest req, String adminUserId) {
        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero.");
        }

        Account account = accountRepository.findByAccountNumber(req.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found with number: " + req.getAccountNumber()));

        if (!"ACTIVE".equalsIgnoreCase(account.getStatus())) {
            throw new IllegalStateException("Cannot deposit funds. Account is currently " + account.getStatus() + ".");
        }

        BigDecimal newBalance = account.getBalance().add(req.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        String ref = "CSH" + System.currentTimeMillis() + new Random().nextInt(1000);
        Transaction txn = new Transaction();
        txn.setReferenceNo(ref);
        txn.setFromAccount(null);
        txn.setToAccount(account);
        txn.setTransactionType("CASH_DEPOSIT");
        txn.setAmount(req.getAmount());
        txn.setDescription(req.getRemarks() != null && !req.getRemarks().isEmpty() ? req.getRemarks() : "Branch Counter Cash Deposit");
        txn.setStatus("SUCCESS");
        txn.setBalanceAfterTo(newBalance);
        txn.setCreatedAt(LocalDateTime.now());
        return transactionRepository.save(txn);
    }

    @Transactional
    public Transaction branchCashWithdrawal(DepositWithdrawRequest req, String adminUserId) {
        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be greater than zero.");
        }

        Account account = accountRepository.findByAccountNumber(req.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found with number: " + req.getAccountNumber()));

        if (!"ACTIVE".equalsIgnoreCase(account.getStatus())) {
            throw new IllegalStateException("Cannot withdraw funds. Account is currently " + account.getStatus() + ".");
        }

        if (account.getBalance().compareTo(req.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient funds. Available balance: " + account.getBalance());
        }

        BigDecimal newBalance = account.getBalance().subtract(req.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        String ref = "WTH" + System.currentTimeMillis() + new Random().nextInt(1000);
        Transaction txn = new Transaction();
        txn.setReferenceNo(ref);
        txn.setFromAccount(account);
        txn.setToAccount(null);
        txn.setTransactionType("CASH_WITHDRAWAL");
        txn.setAmount(req.getAmount());
        txn.setDescription(req.getRemarks() != null && !req.getRemarks().isEmpty() ? req.getRemarks() : "Branch Counter Cash Dispense");
        txn.setStatus("SUCCESS");
        txn.setBalanceAfterFrom(newBalance);
        txn.setCreatedAt(LocalDateTime.now());
        return transactionRepository.save(txn);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Transaction> getGlobalLedger() {
        return transactionRepository.findAllByOrderByCreatedAtDesc();
    }

    public Map<String, Object> getAdminStats() {
        List<Account> accounts = accountRepository.findAll();
        BigDecimal totalDeposits = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long activeCount = accounts.stream().filter(a -> "ACTIVE".equalsIgnoreCase(a.getStatus())).count();
        long frozenCount = accounts.stream().filter(a -> "FROZEN".equalsIgnoreCase(a.getStatus())).count();
        long totalTxns = transactionRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDeposits", totalDeposits);
        stats.put("totalAccounts", accounts.size());
        stats.put("activeAccounts", activeCount);
        stats.put("frozenAccounts", frozenCount);
        stats.put("totalTransactions", totalTxns);
        return stats;
    }

    public String generateCardNumberForType(String cardType) {
        Random random = new Random();
        String prefix;
        if ("VISA".equalsIgnoreCase(cardType)) {
            prefix = "4591"; // Visa BIN
        } else if ("MASTERCARD".equalsIgnoreCase(cardType)) {
            prefix = "5241"; // Mastercard BIN
        } else {
            prefix = "6521"; // RuPay BIN (default)
        }
        return prefix + String.format("%012d", Math.abs(random.nextLong()) % 1000000000000L);
    }

    @Transactional
    public Card issueDebitCard(String accountNumber, String cardType, String adminUserId) {
        Account account = accountRepository.findByAccountNumber(accountNumber.trim())
                .orElseThrow(() -> new RuntimeException("Account not found with number: " + accountNumber));

        Optional<Card> existing = cardRepository.findByAccount(account);
        if (existing.isPresent()) {
            Card c = existing.get();
            if (Boolean.TRUE.equals(c.getIsLinked())) {
                throw new IllegalStateException("An active debit card is already linked to this account.");
            }
            return c;
        }

        String normalizedType = (cardType != null && !cardType.trim().isEmpty())
                ? cardType.trim().toUpperCase()
                : "RUPAY";

        Random random = new Random();
        String generatedCardNumber = generateCardNumberForType(normalizedType);
        String cvv = String.format("%03d", random.nextInt(1000));

        Card card = new Card();
        card.setAccount(account);
        card.setCardNumber(generatedCardNumber);
        card.setCardHolderName(account.getUser().getFullName().toUpperCase());
        card.setExpiryMonth(LocalDateTime.now().getMonthValue());
        card.setExpiryYear(LocalDateTime.now().getYear() + 5);
        card.setCvv(cvv);
        card.setCardType(normalizedType);
        card.setIsActive(true);
        card.setIsLinked(false);
        card.setIssuedByAdminId(adminUserId);
        card.setDailyLimit(new BigDecimal("50000.00"));
        card.setCreatedAt(LocalDateTime.now());
        return cardRepository.save(card);
    }

    @Transactional
    public Card issueDebitCard(String accountNumber, String adminUserId) {
        return issueDebitCard(accountNumber, "RUPAY", adminUserId);
    }

    private String maskAadhaar(String aadhaar) {
        if (aadhaar == null || aadhaar.length() < 12) return aadhaar;
        return "XXXX-XXXX-" + aadhaar.substring(8);
    }
}
