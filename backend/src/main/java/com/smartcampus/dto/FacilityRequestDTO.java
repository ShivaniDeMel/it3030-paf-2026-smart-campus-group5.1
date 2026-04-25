package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class FacilityRequestDTO {
    
    @NotBlank(message = "Facility name is required")
    @Size(max = 100, message = "Facility name must not exceed 100 characters")
    private String name;
    
    @NotBlank(message = "Facility type is required")
    private String type;
    
    private String subtype;
    
    private String location;
    
    private String building;
    
    private String floor;
    
    private String room;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 1000, message = "Capacity must not exceed 1000")
    private Integer capacity;
    
    private String status = "ACTIVE";
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    private String availableStartTime = "08:00";
    
    private String availableEndTime = "22:00";
    
    private Boolean availableWeekends = false;

    // Constructors
    public FacilityRequestDTO() {}

    public FacilityRequestDTO(String name, String type, Integer capacity, String location) {
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSubtype() {
        return subtype;
    }

    public void setSubtype(String subtype) {
        this.subtype = subtype;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAvailableStartTime() {
        return availableStartTime;
    }

    public void setAvailableStartTime(String availableStartTime) {
        this.availableStartTime = availableStartTime;
    }

    public String getAvailableEndTime() {
        return availableEndTime;
    }

    public void setAvailableEndTime(String availableEndTime) {
        this.availableEndTime = availableEndTime;
    }

    public Boolean getAvailableWeekends() {
        return availableWeekends;
    }

    public void setAvailableWeekends(Boolean availableWeekends) {
        this.availableWeekends = availableWeekends;
    }

    @Override
    public String toString() {
        return "FacilityRequestDTO{" +
                "name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", capacity=" + capacity +
                ", location='" + location + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
