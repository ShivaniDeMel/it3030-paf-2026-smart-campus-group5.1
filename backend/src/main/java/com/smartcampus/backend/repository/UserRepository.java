package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.model.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByRole(UserRole role);
    List<User> findByRole(UserRole role);
}
