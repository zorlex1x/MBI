package com.bank.bms.repository;

import com.bank.bms.model.OtpSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpSessionRepository extends JpaRepository<OtpSession, Long> {
    Optional<OtpSession> findTopByUserIdAndPurposeOrderByCreatedAtDesc(String userId, String purpose);
    Optional<OtpSession> findTopByMobileNumberAndPurposeOrderByCreatedAtDesc(String mobileNumber, String purpose);
}
