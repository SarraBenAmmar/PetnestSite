package com.example.petnestspring.repository;

import com.example.petnestspring.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT * FROM user u WHERE u.email = :email", nativeQuery = true)
    Optional<User> findByEmailNativeQuery(String email);

    Optional<User> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE User a SET a.enabled = TRUE WHERE a.email = ?1")
    int enableUser(String email);
}
