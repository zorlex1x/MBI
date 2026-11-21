package com.bank.bms.repository;

import com.bank.bms.model.Account;
import com.bank.bms.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByReferenceNo(String referenceNo);

    @Query("SELECT t FROM Transaction t WHERE t.fromAccount = :account OR t.toAccount = :account ORDER BY t.createdAt DESC")
    List<Transaction> findByAccountOrderByCreatedAtDesc(@Param("account") Account account);

    List<Transaction> findAllByOrderByCreatedAtDesc();

    @Query("SELECT t FROM Transaction t WHERE (t.fromAccount = :account OR t.toAccount = :account) " +
           "AND t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findByAccountAndDateRange(
            @Param("account") Account account,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
