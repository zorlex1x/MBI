package com.bank.bms.dto;

public class VerifyOtpRequest {
    private String userId;
    private String otpCode;
    private String purpose = "LOGIN_2FA"; // "LOGIN_2FA" or "AADHAAR_KYC"

    public VerifyOtpRequest() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
}
