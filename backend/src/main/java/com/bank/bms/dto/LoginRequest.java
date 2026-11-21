package com.bank.bms.dto;

public class LoginRequest {
    private String userId;
    private String password;
    private String mpin;
    private String loginType = "PASSWORD"; // "PASSWORD" or "MPIN"

    public LoginRequest() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getMpin() { return mpin; }
    public void setMpin(String mpin) { this.mpin = mpin; }

    public String getLoginType() { return loginType; }
    public void setLoginType(String loginType) { this.loginType = loginType; }
}
