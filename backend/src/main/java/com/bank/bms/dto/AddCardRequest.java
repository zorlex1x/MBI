package com.bank.bms.dto;

public class AddCardRequest {
    private String userId;
    private String mpin;
    private String otp;

    public AddCardRequest() {}

    public AddCardRequest(String userId, String mpin, String otp) {
        this.userId = userId;
        this.mpin = mpin;
        this.otp = otp;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMpin() {
        return mpin;
    }

    public void setMpin(String mpin) {
        this.mpin = mpin;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
