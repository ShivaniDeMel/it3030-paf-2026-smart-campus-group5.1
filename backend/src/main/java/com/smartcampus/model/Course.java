package com.smartcampus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "courses")
public class Course {
    
    @Id
    private String id;
    
    @NotBlank(message = "Course code is required")
    @Field("course_code")
    private String courseCode;
    
    @NotBlank(message = "Course name is required")
    @Size(max = 100, message = "Course name must not exceed 100 characters")
    @Field("course_name")
    private String courseName;
    
    @Field("description")
    private String description;
    
    @Field("credits")
    private Integer credits;
    
    @Field("department")
    private String department;
    
    @Field("instructor_id")
    private String instructorId;
    
    @Field("instructor_name")
    private String instructorName;
    
    @Field("semester")
    private String semester;
    
    @Field("academic_year")
    private String academicYear;
    
    @Field("max_students")
    private Integer maxStudents;
    
    @Field("enrolled_students")
    private List<String> enrolledStudents;
    
    @Field("schedule")
    private String schedule;
    
    @Field("classroom")
    private String classroom;
    
    @Field("is_active")
    private Boolean isActive = true;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Default constructor
    public Course() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor with required fields
    public Course(String courseCode, String courseName) {
        this();
        this.courseCode = courseCode;
        this.courseName = courseName;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getCourseCode() {
        return courseCode;
    }
    
    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }
    
    public Integer getCredits() {
        return credits;
    }
    
    public void setCredits(Integer credits) {
        this.credits = credits;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getInstructorId() {
        return instructorId;
    }
    
    public void setInstructorId(String instructorId) {
        this.instructorId = instructorId;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getInstructorName() {
        return instructorName;
    }
    
    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getSemester() {
        return semester;
    }
    
    public void setSemester(String semester) {
        this.semester = semester;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getAcademicYear() {
        return academicYear;
    }
    
    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
        this.updatedAt = LocalDateTime.now();
    }
    
    public Integer getMaxStudents() {
        return maxStudents;
    }
    
    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
        this.updatedAt = LocalDateTime.now();
    }
    
    public List<String> getEnrolledStudents() {
        return enrolledStudents;
    }
    
    public void setEnrolledStudents(List<String> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getSchedule() {
        return schedule;
    }
    
    public void setSchedule(String schedule) {
        this.schedule = schedule;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getClassroom() {
        return classroom;
    }
    
    public void setClassroom(String classroom) {
        this.classroom = classroom;
        this.updatedAt = LocalDateTime.now();
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
