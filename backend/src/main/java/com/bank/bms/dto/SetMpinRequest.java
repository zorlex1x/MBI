package com.bank.bms.dto;

public class SetMpinRequest {
    private String userId;
    private String mpin;
    private String confirmMpin;
    private String otpCode;

    public SetMpinRequest() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getMpin() { return mpin; }
    public void setMpin(String mpin) { this.mpin = mpin; }

    public String getConfirmMpin() { return confirmMpin; }
    public void setConfirmMpin(String confirmMpin) { this.confirmMpin = confirmMpin; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
}
