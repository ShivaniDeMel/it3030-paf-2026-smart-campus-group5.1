package com.smartcampus.backend.dto;

import com.smartcampus.backend.entity.Facility;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacilityDTO {
    
    private Long id;
    private String name;
    private Facility.FacilityType type;
    private Integer capacity;
    private String location;
    private String description;
    private Facility.FacilityStatus status;
    private LocalTime availableStartTime;
    private LocalTime availableEndTime;
    private Boolean availableWeekends;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static FacilityDTO fromEntity(Facility facility) {
        FacilityDTO dto = new FacilityDTO();
        dto.setId(facility.getId());
        dto.setName(facility.getName());
        dto.setType(facility.getType());
        dto.setCapacity(facility.getCapacity());
        dto.setLocation(facility.getLocation());
        dto.setDescription(facility.getDescription());
        dto.setStatus(facility.getStatus());
        dto.setAvailableStartTime(facility.getAvailableStartTime());
        dto.setAvailableEndTime(facility.getAvailableEndTime());
        dto.setAvailableWeekends(facility.getAvailableWeekends());
        dto.setImageUrl(facility.getImageUrl());
        dto.setCreatedAt(facility.getCreatedAt());
        dto.setUpdatedAt(facility.getUpdatedAt());
        return dto;
    }
    
    public Facility toEntity() {
        Facility facility = new Facility();
        facility.setId(this.id);
        facility.setName(this.name);
        facility.setType(this.type);
        facility.setCapacity(this.capacity);
        facility.setLocation(this.location);
        facility.setDescription(this.description);
        facility.setStatus(this.status);
        facility.setAvailableStartTime(this.availableStartTime);
        facility.setAvailableEndTime(this.availableEndTime);
        facility.setAvailableWeekends(this.availableWeekends);
        facility.setImageUrl(this.imageUrl);
        return facility;
    }
}
