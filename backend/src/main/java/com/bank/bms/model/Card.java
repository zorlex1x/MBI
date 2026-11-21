package com.bank.bms.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "card_number", unique = true, nullable = false, length = 20)
    private String cardNumber;

    @Column(name = "card_holder_name", nullable = false, length = 120)
    private String cardHolderName;

    @Column(name = "expiry_month", nullable = false)
    private Integer expiryMonth;

    @Column(name = "expiry_year", nullable = false)
    private Integer expiryYear;

    @Column(name = "cvv", nullable = false, length = 4)
    private String cvv;

    @Column(name = "card_type", nullable = false, length = 30)
    private String cardType = "PLATINUM_VISA";

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_linked", nullable = false)
    private Boolean isLinked = false;

    @Column(name = "issued_by_admin_id", length = 50)
    private String issuedByAdminId;

    @Column(name = "linked_at")
    private LocalDateTime linkedAt;

    @Column(name = "daily_limit", nullable = false, precision = 15, scale = 2)
    private BigDecimal dailyLimit = new BigDecimal("50000.00");

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Card() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getCardHolderName() { return cardHolderName; }
    public void setCardHolderName(String cardHolderName) { this.cardHolderName = cardHolderName; }

    public Integer getExpiryMonth() { return expiryMonth; }
    public void setExpiryMonth(Integer expiryMonth) { this.expiryMonth = expiryMonth; }

    public Integer getExpiryYear() { return expiryYear; }
    public void setExpiryYear(Integer expiryYear) { this.expiryYear = expiryYear; }

    public String getCvv() { return cvv; }
    public void setCvv(String cvv) { this.cvv = cvv; }

    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsLinked() { return isLinked; }
    public void setIsLinked(Boolean isLinked) { this.isLinked = isLinked; }

    public String getIssuedByAdminId() { return issuedByAdminId; }
    public void setIssuedByAdminId(String issuedByAdminId) { this.issuedByAdminId = issuedByAdminId; }

    public LocalDateTime getLinkedAt() { return linkedAt; }
    public void setLinkedAt(LocalDateTime linkedAt) { this.linkedAt = linkedAt; }

    public BigDecimal getDailyLimit() { return dailyLimit; }
    public void setDailyLimit(BigDecimal dailyLimit) { this.dailyLimit = dailyLimit; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
