package com.bank.bms.repository;

import com.bank.bms.model.Account;
import com.bank.bms.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByAccount(Account account);
    Optional<Card> findByCardNumber(String cardNumber);
}
