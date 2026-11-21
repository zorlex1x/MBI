package com.bank.bms.dto;

import java.math.BigDecimal;

public class TransferRequest {
    private String fromAccountNumber;
    private String toAccountNumber;
    private String beneficiaryName;
    private String ifscCode;
    private BigDecimal amount;
    private String description;
    private String transferType = "INTERNAL_TRANSFER"; // "INTERNAL_TRANSFER", "NEFT", "IMPS"
    private String mpin; // Mandatory 6-digit MPIN

    public TransferRequest() {}

    public String getFromAccountNumber() { return fromAccountNumber; }
    public void setFromAccountNumber(String fromAccountNumber) { this.fromAccountNumber = fromAccountNumber; }

    public String getToAccountNumber() { return toAccountNumber; }
    public void setToAccountNumber(String toAccountNumber) { this.toAccountNumber = toAccountNumber; }

    public String getBeneficiaryName() { return beneficiaryName; }
    public void setBeneficiaryName(String beneficiaryName) { this.beneficiaryName = beneficiaryName; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTransferType() { return transferType; }
    public void setTransferType(String transferType) { this.transferType = transferType; }

    public String getMpin() { return mpin; }
    public void setMpin(String mpin) { this.mpin = mpin; }
}
