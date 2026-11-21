package com.bank.bms.repository;

import com.bank.bms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);
    Optional<User> findByEmail(String email);
    Optional<User> findByUserIdOrEmail(String userId, String email);
    boolean existsByUserId(String userId);
    boolean existsByEmail(String email);
    boolean existsByAadhaarNumber(String aadhaarNumber);
    List<User> findByRoleOrderByCreatedAtDesc(String role);
}
