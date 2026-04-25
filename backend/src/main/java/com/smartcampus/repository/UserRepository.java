package com.smartcampus.repository;

import com.smartcampus.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository("legacyUserRepository")
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByStudentId(String studentId);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByStudentId(String studentId);
    
    @Query("{ 'role': ?0, 'isActive': true }")
    List<User> findByRoleAndIsActive(String role);
    
    @Query("{ 'department': ?0, 'isActive': true }")
    List<User> findByDepartmentAndIsActive(String department);
    
    @Query("{ 'enrolledCourses': ?0, 'isActive': true }")
    List<User> findByEnrolledCourseAndIsActive(String courseId);
    
    @Query("{ 'enrolledCourses': ?0, 'isActive': true }")
    List<User> findByEnrolledCourse(String courseId);
}
