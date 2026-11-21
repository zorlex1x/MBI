package com.bank.bms.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_no", unique = true, nullable = false, length = 40)
    private String referenceNo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "to_account_id")
    private Account toAccount;

    @Column(name = "transaction_type", nullable = false, length = 40)
    private String transactionType; // "OPENING_DEPOSIT", "INTERNAL_TRANSFER", "NEFT", "IMPS", "CASH_DEPOSIT", "CASH_WITHDRAWAL"

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "SUCCESS"; // "SUCCESS", "FAILED"

    @Column(name = "balance_after_from", precision = 15, scale = 2)
    private BigDecimal balanceAfterFrom;

    @Column(name = "balance_after_to", precision = 15, scale = 2)
    private BigDecimal balanceAfterTo;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Transaction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }

    public Account getFromAccount() { return fromAccount; }
    public void setFromAccount(Account fromAccount) { this.fromAccount = fromAccount; }

    public Account getToAccount() { return toAccount; }
    public void setToAccount(Account toAccount) { this.toAccount = toAccount; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getBalanceAfterFrom() { return balanceAfterFrom; }
    public void setBalanceAfterFrom(BigDecimal balanceAfterFrom) { this.balanceAfterFrom = balanceAfterFrom; }

    public BigDecimal getBalanceAfterTo() { return balanceAfterTo; }
    public void setBalanceAfterTo(BigDecimal balanceAfterTo) { this.balanceAfterTo = balanceAfterTo; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
