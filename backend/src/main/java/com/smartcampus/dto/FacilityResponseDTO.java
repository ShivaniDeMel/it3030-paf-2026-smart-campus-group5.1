package com.smartcampus.dto;

import com.smartcampus.model.Facility;

import java.time.LocalDateTime;
import java.util.List;

public class FacilityResponseDTO {
    
    private String id;
    private String name;
    private String type;
    private String subtype;
    private String location;
    private String building;
    private String floor;
    private String room;
    private Integer capacity;
    private String status;
    private String description;
    private List<String> amenities;
    private List<String> equipment;
    private List<String> rules;
    private List<String> images;
    private Facility.AvailableHours availableHours;
    private Facility.BookingSettings bookingSettings;
    private Double utilizationRate;
    private Integer totalBookings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    // Constructors
    public FacilityResponseDTO() {}

    public FacilityResponseDTO(Facility facility) {
        this.id = facility.getId();
        this.name = facility.getName();
        this.type = facility.getType();
        this.subtype = facility.getSubtype();
        this.location = facility.getLocation();
        this.building = facility.getBuilding();
        this.floor = facility.getFloor();
        this.room = facility.getRoom();
        this.capacity = facility.getCapacity();
        this.status = facility.getStatus();
        this.description = facility.getDescription();
        this.amenities = facility.getAmenities();
        this.equipment = facility.getEquipment();
        this.rules = facility.getRules();
        this.images = facility.getImages();
        this.availableHours = facility.getAvailableHours();
        this.bookingSettings = facility.getBookingSettings();
        this.utilizationRate = facility.getUtilizationRate();
        this.totalBookings = facility.getTotalBookings();
        this.createdAt = facility.getCreatedAt();
        this.updatedAt = facility.getUpdatedAt();
        this.createdBy = facility.getCreatedBy();
        this.updatedBy = facility.getUpdatedBy();
    }

    // Static factory method
    public static FacilityResponseDTO fromEntity(Facility facility) {
        return new FacilityResponseDTO(facility);
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public List<String> getEquipment() {
        return equipment;
    }

    public void setEquipment(List<String> equipment) {
        this.equipment = equipment;
    }

    public List<String> getRules() {
        return rules;
    }

    public void setRules(List<String> rules) {
        this.rules = rules;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public Facility.AvailableHours getAvailableHours() {
        return availableHours;
    }

    public void setAvailableHours(Facility.AvailableHours availableHours) {
        this.availableHours = availableHours;
    }

    public Facility.BookingSettings getBookingSettings() {
        return bookingSettings;
    }

    public void setBookingSettings(Facility.BookingSettings bookingSettings) {
        this.bookingSettings = bookingSettings;
    }

    public Double getUtilizationRate() {
        return utilizationRate;
    }

    public void setUtilizationRate(Double utilizationRate) {
        this.utilizationRate = utilizationRate;
    }

    public Integer getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    @Override
    public String toString() {
        return "FacilityResponseDTO{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", capacity=" + capacity +
                ", location='" + location + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
