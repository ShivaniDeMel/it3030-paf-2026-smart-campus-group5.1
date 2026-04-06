package com.smartcampus.backend.entity;

import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "facilities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facility {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Facility name is required")
    @Size(max = 100, message = "Facility name must not exceed 100 characters")
    @Column(name = "name")
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private FacilityType type;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 1000, message = "Capacity must not exceed 1000")
    @Column(name = "capacity")
    private Integer capacity;
    
    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must not exceed 200 characters")
    @Column(name = "location")
    private String location;
    
    @Column(name = "description")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FacilityStatus status;
    
    @Column(name = "available_start_time")
    private LocalTime availableStartTime;
    
    @Column(name = "available_end_time")
    private LocalTime availableEndTime;
    
    @Column(name = "available_weekends")
    private Boolean availableWeekends;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum FacilityType {
        LECTURE_HALL,
        LABORATORY,
        MEETING_ROOM,
        AUDITORIUM,
        SPORTS_FACILITY,
        STUDY_AREA,
        EQUIPMENT
    }
    
    public enum FacilityStatus {
        ACTIVE,
        OUT_OF_SERVICE,
        MAINTENANCE,
        RESERVED
    }
}
