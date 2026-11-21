package com.bank.bms.repository;

import com.bank.bms.model.Account;
import com.bank.bms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByUser(User user);
    Optional<Account> findFirstByUser(User user);
    boolean existsByAccountNumber(String accountNumber);
    List<Account> findAllByOrderByCreatedAtDesc();
}
