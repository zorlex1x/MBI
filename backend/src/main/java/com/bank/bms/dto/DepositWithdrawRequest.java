package com.bank.bms.dto;

import java.math.BigDecimal;

public class DepositWithdrawRequest {
    private String accountNumber;
    private BigDecimal amount;
    private String remarks;

    public DepositWithdrawRequest() {}

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
