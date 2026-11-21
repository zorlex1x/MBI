package com.bank.bms.config;

import com.bank.bms.model.*;
import com.bank.bms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(UserRepository userRepository,
                           AccountRepository accountRepository,
                           CardRepository cardRepository,
                           TransactionRepository transactionRepository,
                           BeneficiaryRepository beneficiaryRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.cardRepository = cardRepository;
        this.transactionRepository = transactionRepository;
        this.beneficiaryRepository = beneficiaryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.existsByUserId("admin")) {
            return; // Already initialized
        }

        // 1. Seed Bank Administrator
        User admin = new User();
        admin.setUserId("admin");
        admin.setFullName("Bank Operations Director");
        admin.setEmail("admin@mbibank.com");
        admin.setPasswordHash(passwordEncoder.encode("Admin@12345"));
        admin.setMpinHash(passwordEncoder.encode("9876"));
        admin.setIsMpinSet(true);
        admin.setMobileNumber("9876543210");
        admin.setAadhaarNumber("999988887777");
        admin.setPanNumber("MBINA0001B");
        admin.setRole("ADMIN");
        admin.setStatus("ACTIVE");
        admin.setAddress("MBI Towers, Bandra Kurla Complex");
        admin.setCity("Mumbai");
        admin.setState("Maharashtra");
        admin.setPinCode("400051");
        admin.setCreatedAt(LocalDateTime.now().minusDays(30));
        userRepository.save(admin);

        // Dummy customer accounts removed as requested: 
        // Admin will create customer accounts with any balance directly via the Admin Console.
    }
}
