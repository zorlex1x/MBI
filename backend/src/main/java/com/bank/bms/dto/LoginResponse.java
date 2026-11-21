package com.bank.bms.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private boolean requiresOtp;
    private String tempToken;
    private String mobileMasked;
    private String otpPreview; // for smooth testing experience
    private String role;
    private String userId;
    private String fullName;
    private String email;
    private String accountNumber;
    private Boolean isMpinSet;
    private Integer birthYear;

    public LoginResponse() {}

    public static LoginResponse otpRequired(String userId, String mobileMasked, String otpPreview, String tempToken) {
        LoginResponse resp = new LoginResponse();
        resp.setSuccess(true);
        resp.setRequiresOtp(true);
        resp.setUserId(userId);
        resp.setMobileMasked(mobileMasked);
        resp.setOtpPreview(otpPreview);
        resp.setTempToken(tempToken);
        resp.setMessage("OTP sent to registered mobile " + mobileMasked);
        return resp;
    }

    public static LoginResponse loggedIn(String role, String userId, String fullName, String email, String accountNumber, Boolean isMpinSet, Integer birthYear) {
        LoginResponse resp = new LoginResponse();
        resp.setSuccess(true);
        resp.setRequiresOtp(false);
        resp.setRole(role);
        resp.setUserId(userId);
        resp.setFullName(fullName);
        resp.setEmail(email);
        resp.setAccountNumber(accountNumber);
        resp.setIsMpinSet(isMpinSet);
        resp.setBirthYear(birthYear);
        resp.setMessage("Login successful");
        return resp;
    }

    public static LoginResponse loggedIn(String role, String userId, String fullName, String email, String accountNumber, Boolean isMpinSet) {
        return loggedIn(role, userId, fullName, email, accountNumber, isMpinSet, null);
    }

    public static LoginResponse failed(String message) {
        LoginResponse resp = new LoginResponse();
        resp.setSuccess(false);
        resp.setMessage(message);
        return resp;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRequiresOtp() { return requiresOtp; }
    public void setRequiresOtp(boolean requiresOtp) { this.requiresOtp = requiresOtp; }

    public String getTempToken() { return tempToken; }
    public void setTempToken(String tempToken) { this.tempToken = tempToken; }

    public String getMobileMasked() { return mobileMasked; }
    public void setMobileMasked(String mobileMasked) { this.mobileMasked = mobileMasked; }

    public String getOtpPreview() { return otpPreview; }
    public void setOtpPreview(String otpPreview) { this.otpPreview = otpPreview; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public Boolean getIsMpinSet() { return isMpinSet; }
    public void setIsMpinSet(Boolean isMpinSet) { this.isMpinSet = isMpinSet; }

    public Integer getBirthYear() { return birthYear; }
    public void setBirthYear(Integer birthYear) { this.birthYear = birthYear; }
}
