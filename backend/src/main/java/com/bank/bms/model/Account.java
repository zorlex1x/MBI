package com.bank.bms.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "account_number", unique = true, nullable = false, length = 20)
    private String accountNumber;

    @Column(name = "account_type", nullable = false, length = 30)
    private String accountType; // "SAVINGS", "CURRENT", "SALARY"

    @Column(name = "ifsc_code", nullable = false, length = 20)
    private String ifscCode;

    @Column(name = "branch_name", nullable = false, length = 120)
    private String branchName;

    @Column(name = "balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "daily_limit", nullable = false, precision = 15, scale = 2)
    private BigDecimal dailyLimit = new BigDecimal("100000.00");

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE"; // "ACTIVE", "FROZEN", "CLOSED"

    @Column(name = "opened_by_admin_id", length = 32)
    private String openedByAdminId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Account() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public BigDecimal getDailyLimit() { return dailyLimit; }
    public void setDailyLimit(BigDecimal dailyLimit) { this.dailyLimit = dailyLimit; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOpenedByAdminId() { return openedByAdminId; }
    public void setOpenedByAdminId(String openedByAdminId) { this.openedByAdminId = openedByAdminId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
