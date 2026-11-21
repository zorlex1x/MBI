package com.bank.bms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateCustomerRequest {
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private String mobileNumber;
    private String aadhaarNumber;
    private String panNumber;
    private String address;
    private String city;
    private String state;
    private String pinCode;
    private String accountType = "SAVINGS"; // "SAVINGS", "CURRENT", "SALARY"
    private BigDecimal openingDeposit = BigDecimal.ZERO;
    private String branchName = "MBI Central Branch, Mumbai";
    private String aadhaarOtp;
    private Boolean issueDebitCard = false;
    private String debitCardType = "RUPAY"; // "RUPAY", "VISA", "MASTERCARD"

    public CreateCustomerRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public BigDecimal getOpeningDeposit() { return openingDeposit; }
    public void setOpeningDeposit(BigDecimal openingDeposit) { this.openingDeposit = openingDeposit; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getAadhaarOtp() { return aadhaarOtp; }
    public void setAadhaarOtp(String aadhaarOtp) { this.aadhaarOtp = aadhaarOtp; }

    public Boolean getIssueDebitCard() { return issueDebitCard; }
    public void setIssueDebitCard(Boolean issueDebitCard) { this.issueDebitCard = issueDebitCard; }

    public String getDebitCardType() { return debitCardType; }
    public void setDebitCardType(String debitCardType) { this.debitCardType = debitCardType; }
}
