package com.smartcampus.repository;

import com.smartcampus.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    
    Optional<Course> findByCourseCode(String courseCode);
    
    List<Course> findByCourseNameContainingIgnoreCase(String courseName);
    
    List<Course> findByDepartment(String department);
    
    List<Course> findByInstructorId(String instructorId);
    
    List<Course> findBySemesterAndAcademicYear(String semester, String academicYear);
    
    List<Course> findByIsActive(boolean isActive);
    
    @Query(value = "{ $or: [{ 'maxStudents': null }, { $expr: { $lt: [{ $size: { $ifNull: ['$enrolledStudents', []] } }, '$maxStudents'] } }], 'isActive': true }")
    List<Course> findAvailableCourses();
    
    @Query("{ 'enrolledStudents': ?0, 'isActive': true }")
    List<Course> findByEnrolledStudent(String studentId);
    
    boolean existsByCourseCode(String courseCode);
}
