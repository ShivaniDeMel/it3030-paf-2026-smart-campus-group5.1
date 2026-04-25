package com.smartcampus.controller;

import com.smartcampus.model.Course;
import com.smartcampus.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.annotation.Nonnull;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CourseController {
    
    private final CourseService courseService;
    
    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }
    
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable @Nonnull String id) {
        Optional<Course> course = courseService.getCourseById(id);
        if (course.isPresent()) {
            return ResponseEntity.ok(course.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/code/{courseCode}")
    public ResponseEntity<?> getCourseByCode(@PathVariable @Nonnull String courseCode) {
        Optional<Course> course = courseService.getCourseByCourseCode(courseCode);
        if (course.isPresent()) {
            return ResponseEntity.ok(course.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam @Nonnull String name) {
        List<Course> courses = courseService.searchCoursesByName(name);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/department/{department}")
    public ResponseEntity<List<Course>> getCoursesByDepartment(@PathVariable @Nonnull String department) {
        List<Course> courses = courseService.getCoursesByDepartment(department);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable @Nonnull String instructorId) {
        List<Course> courses = courseService.getCoursesByInstructor(instructorId);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/semester/{semester}/year/{academicYear}")
    public ResponseEntity<List<Course>> getCoursesBySemesterAndYear(
            @PathVariable @Nonnull String semester, 
            @PathVariable @Nonnull String academicYear) {
        List<Course> courses = courseService.getCoursesBySemesterAndYear(semester, academicYear);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Course>> getAvailableCourses() {
        List<Course> courses = courseService.getAvailableCourses();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Course>> getStudentCourses(@PathVariable @Nonnull String studentId) {
        List<Course> courses = courseService.getStudentCourses(studentId);
        return ResponseEntity.ok(courses);
    }
    
    @PostMapping
    public ResponseEntity<?> createCourse(@Valid @RequestBody Course course) {
        try {
            Course createdCourse = courseService.createCourse(course);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable @Nonnull String id, @Valid @RequestBody @Nonnull Course courseDetails) {
        try {
            Course updatedCourse = courseService.updateCourse(id, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable @Nonnull String id) {
        try {
            courseService.deleteCourse(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<?> enrollStudent(@PathVariable @Nonnull String courseId, @PathVariable @Nonnull String studentId) {
        try {
            Course course = courseService.enrollStudent(courseId, studentId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{courseId}/drop/{studentId}")
    public ResponseEntity<?> dropStudent(@PathVariable @Nonnull String courseId, @PathVariable @Nonnull String studentId) {
        try {
            Course course = courseService.dropStudent(courseId, studentId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
