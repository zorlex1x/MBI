package com.bank.bms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CustomerWelcomeResponse {
    private boolean success;
    private String message;
    private String userId;
    private String temporaryPassword;
    private String accountNumber;
    private String ifscCode;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private String mobileNumber;
    private String aadhaarMasked;
    private String accountType;
    private String branchName;
    private BigDecimal openingDeposit;
    private String referenceNo;
    private String debitCardStatus;
    private String debitCardNumberMasked;
    private String debitCardType;
    private LocalDateTime createdAt;

    public CustomerWelcomeResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTemporaryPassword() { return temporaryPassword; }
    public void setTemporaryPassword(String temporaryPassword) { this.temporaryPassword = temporaryPassword; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getAadhaarMasked() { return aadhaarMasked; }
    public void setAadhaarMasked(String aadhaarMasked) { this.aadhaarMasked = aadhaarMasked; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public BigDecimal getOpeningDeposit() { return openingDeposit; }
    public void setOpeningDeposit(BigDecimal openingDeposit) { this.openingDeposit = openingDeposit; }

    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }

    public String getDebitCardStatus() { return debitCardStatus; }
    public void setDebitCardStatus(String debitCardStatus) { this.debitCardStatus = debitCardStatus; }

    public String getDebitCardNumberMasked() { return debitCardNumberMasked; }
    public void setDebitCardNumberMasked(String debitCardNumberMasked) { this.debitCardNumberMasked = debitCardNumberMasked; }

    public String getDebitCardType() { return debitCardType; }
    public void setDebitCardType(String debitCardType) { this.debitCardType = debitCardType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
