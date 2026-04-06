package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndIsActive(String email, Boolean isActive);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByEmailAndIsActive(String email, Boolean isActive);
    
    Optional<User> findByPhone(String phone);
    
    Boolean existsByPhone(String phone);
}
