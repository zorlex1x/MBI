package com.bank.bms.repository;

import com.bank.bms.model.Beneficiary;
import com.bank.bms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserAndBeneficiaryAccountNumber(User user, String beneficiaryAccountNumber);
}
