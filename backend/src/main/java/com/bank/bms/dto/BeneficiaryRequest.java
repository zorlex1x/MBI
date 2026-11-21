package com.bank.bms.dto;

public class BeneficiaryRequest {
    private String beneficiaryName;
    private String beneficiaryAccountNumber;
    private String ifscCode;
    private String bankName;
    private String nickname;
    private String mpin;

    public BeneficiaryRequest() {}

    public String getBeneficiaryName() { return beneficiaryName; }
    public void setBeneficiaryName(String beneficiaryName) { this.beneficiaryName = beneficiaryName; }

    public String getBeneficiaryAccountNumber() { return beneficiaryAccountNumber; }
    public void setBeneficiaryAccountNumber(String beneficiaryAccountNumber) { this.beneficiaryAccountNumber = beneficiaryAccountNumber; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getMpin() { return mpin; }
    public void setMpin(String mpin) { this.mpin = mpin; }
}
