package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.UserJPA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserJPARepository extends JpaRepository<UserJPA, Long> {
    
    Optional<UserJPA> findByEmail(String email);
    
    Optional<UserJPA> findByEmailAndIsActive(String email, Boolean isActive);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByEmailAndIsActive(String email, Boolean isActive);
    
    Optional<UserJPA> findByPhone(String phone);
    
    Boolean existsByPhone(String phone);
}
