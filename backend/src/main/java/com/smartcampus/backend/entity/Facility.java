package com.smartcampus.backend.entity;

import jakarta.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Document(collection = "facilities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facility {
    
    @Id
    private String id;
    
    @NotBlank(message = "Facility name is required")
    @Size(max = 100, message = "Facility name must not exceed 100 characters")
    @Field("name")
    private String name;
    
    @Field("type")
    private FacilityType type;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 1000, message = "Capacity must not exceed 1000")
    @Field("capacity")
    private Integer capacity;
    
    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must not exceed 200 characters")
    @Field("location")
    private String location;
    
    @Field("description")
    private String description;
    
    @Field("status")
    private FacilityStatus status;
    
    @Field("available_start_time")
    private LocalTime availableStartTime;
    
    @Field("available_end_time")
    private LocalTime availableEndTime;
    
    @Field("available_weekends")
    private Boolean availableWeekends;
    
    @Field("image_url")
    private String imageUrl;
    
    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Field("updated_at")
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
