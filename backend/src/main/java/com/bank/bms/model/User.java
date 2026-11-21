package com.bank.bms.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false, length = 32)
    private String userId;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(name = "email", unique = true, nullable = false, length = 120)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "mpin_hash", length = 255)
    private String mpinHash;

    @Column(name = "is_mpin_set")
    private Boolean isMpinSet = false;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "mobile_number", nullable = false, length = 20)
    private String mobileNumber;

    @Column(name = "aadhaar_number", nullable = false, length = 16)
    private String aadhaarNumber;

    @Column(name = "pan_number", length = 12)
    private String panNumber;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "city", length = 80)
    private String city;

    @Column(name = "state", length = 80)
    private String state;

    @Column(name = "pin_code", length = 10)
    private String pinCode;

    @Column(name = "role", nullable = false, length = 20)
    private String role; // "ADMIN" or "CUSTOMER"

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE"; // "ACTIVE", "FROZEN", "CLOSED"

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getMpinHash() { return mpinHash; }
    public void setMpinHash(String mpinHash) { this.mpinHash = mpinHash; }

    public Boolean getIsMpinSet() { return isMpinSet; }
    public void setIsMpinSet(Boolean isMpinSet) { this.isMpinSet = isMpinSet; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getAadhaarNumber() { return aadhaarNumber; }
    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
