package com.smartcampus.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class FacilitySearchDTO {
    
    private String type;
    private String subtype;
    private String status;
    private String location;
    private String building;
    private String floor;
    
    @Min(value = 1, message = "Minimum capacity must be at least 1")
    private Integer minCapacity;
    
    @Max(value = 1000, message = "Maximum capacity must not exceed 1000")
    private Integer maxCapacity;
    
    private String keyword; // For searching in name or description
    private Boolean availableWeekends;
    private String startTime; // Filter by available start time
    private String endTime; // Filter by available end time
    private String sortBy = "name"; // Default sort by name
    private String sortDirection = "asc"; // asc or desc

    // Constructors
    public FacilitySearchDTO() {}

    public FacilitySearchDTO(String type, String status) {
        this.type = type;
        this.status = status;
    }

    // Getters and Setters
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public Integer getMinCapacity() {
        return minCapacity;
    }

    public void setMinCapacity(Integer minCapacity) {
        this.minCapacity = minCapacity;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Boolean getAvailableWeekends() {
        return availableWeekends;
    }

    public void setAvailableWeekends(Boolean availableWeekends) {
        this.availableWeekends = availableWeekends;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortDirection() {
        return sortDirection;
    }

    public void setSortDirection(String sortDirection) {
        this.sortDirection = sortDirection;
    }

    @Override
    public String toString() {
        return "FacilitySearchDTO{" +
                "type='" + type + '\'' +
                ", status='" + status + '\'' +
                ", location='" + location + '\'' +
                ", minCapacity=" + minCapacity +
                ", maxCapacity=" + maxCapacity +
                ", keyword='" + keyword + '\'' +
                ", sortBy='" + sortBy + '\'' +
                ", sortDirection='" + sortDirection + '\'' +
                '}';
    }
}
