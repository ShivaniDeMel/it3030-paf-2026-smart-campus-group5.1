package com.smartcampus.service;

import com.smartcampus.model.Course;
import com.smartcampus.repository.CourseRepository;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.exception.ResourceAlreadyExistsException;
import com.smartcampus.exception.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    
    private final CourseRepository courseRepository;
    
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
    
    @Transactional
    public Course createCourse(Course course) {
        if (courseRepository.existsByCourseCode(course.getCourseCode())) {
            throw new ResourceAlreadyExistsException("Course code already exists");
        }
        return courseRepository.save(course);
    }
    
    public Optional<Course> getCourseById(@NonNull String id) {
        return courseRepository.findById(id);
    }
    
    public Optional<Course> getCourseByCourseCode(@NonNull String courseCode) {
        return courseRepository.findByCourseCode(courseCode);
    }
    
    public List<Course> getAllCourses() {
        return courseRepository.findByIsActive(true);
    }
    
    public List<Course> searchCoursesByName(@NonNull String courseName) {
        return courseRepository.findByCourseNameContainingIgnoreCase(courseName);
    }
    
    public List<Course> getCoursesByDepartment(@NonNull String department) {
        return courseRepository.findByDepartment(department);
    }
    
    public List<Course> getCoursesByInstructor(@NonNull String instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }
    
    public List<Course> getCoursesBySemesterAndYear(@NonNull String semester, @NonNull String academicYear) {
        return courseRepository.findBySemesterAndAcademicYear(semester, academicYear);
    }
    
    public List<Course> getAvailableCourses() {
        return courseRepository.findAvailableCourses();
    }
    
    @Transactional
    public @Nullable Course updateCourse(@NonNull String id, @NonNull Course courseDetails) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        if (courseDetails.getCourseName() != null) {
            course.setCourseName(courseDetails.getCourseName());
        }
        
        if (courseDetails.getDescription() != null) {
            course.setDescription(courseDetails.getDescription());
        }
        
        if (courseDetails.getCredits() != null) {
            course.setCredits(courseDetails.getCredits());
        }
        
        if (courseDetails.getDepartment() != null) {
            course.setDepartment(courseDetails.getDepartment());
        }
        
        if (courseDetails.getInstructorId() != null) {
            course.setInstructorId(courseDetails.getInstructorId());
        }
        
        if (courseDetails.getInstructorName() != null) {
            course.setInstructorName(courseDetails.getInstructorName());
        }
        
        if (courseDetails.getSemester() != null) {
            course.setSemester(courseDetails.getSemester());
        }
        
        if (courseDetails.getAcademicYear() != null) {
            course.setAcademicYear(courseDetails.getAcademicYear());
        }
        
        if (courseDetails.getMaxStudents() != null) {
            course.setMaxStudents(courseDetails.getMaxStudents());
        }
        
        if (courseDetails.getSchedule() != null) {
            course.setSchedule(courseDetails.getSchedule());
        }
        
        if (courseDetails.getClassroom() != null) {
            course.setClassroom(courseDetails.getClassroom());
        }
        
        Course result = courseRepository.save(course);
        return result;
    }
    
    @Transactional
    public void deleteCourse(@NonNull String id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setIsActive(false);
        courseRepository.save(course);
    }
    
    @Transactional
    public Course enrollStudent(@NonNull String courseId, @NonNull String studentId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        List<String> enrolledStudents = course.getEnrolledStudents();
        if (enrolledStudents == null) {
            enrolledStudents = new ArrayList<>();
            course.setEnrolledStudents(enrolledStudents);
        }
        
        if (course.getMaxStudents() != null && 
            enrolledStudents.size() >= course.getMaxStudents()) {
            throw new BusinessException("Course is full");
        }
        
        if (!enrolledStudents.contains(studentId)) {
            enrolledStudents.add(studentId);
        }
        
        return courseRepository.save(course);
    }
    
    @Transactional
    public Course dropStudent(@NonNull String courseId, @NonNull String studentId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        List<String> enrolledStudents = course.getEnrolledStudents();
        if (enrolledStudents != null) {
            enrolledStudents.remove(studentId);
        }
        
        return courseRepository.save(course);
    }
    
    public List<Course> getStudentCourses(@NonNull String studentId) {
        return courseRepository.findByEnrolledStudent(studentId);
    }
}
