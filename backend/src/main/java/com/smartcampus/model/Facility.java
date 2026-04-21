package com.smartcampus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "facilities")
public class Facility {
    
    @Id
    private String id;
    
    @NotBlank(message = "Facility name is required")
    @Size(max = 100, message = "Facility name must not exceed 100 characters")
    @Field("name")
    private String name;
    
    @NotBlank(message = "Facility type is required")
    @Field("type")
    private String type;
    
    @Field("subtype")
    private String subtype;
    
    @Field("location")
    private String location;
    
    @Field("building")
    private String building;
    
    @Field("floor")
    private String floor;
    
    @Field("room")
    private String room;
    
    @NotNull(message = "Capacity is required")
    @Field("capacity")
    private Integer capacity;
    
    @Field("status")
    private String status = "active";
    
    @Field("description")
    private String description;
    
    @Field("amenities")
    private List<String> amenities;
    
    @Field("equipment")
    private List<String> equipment;
    
    @Field("rules")
    private List<String> rules;
    
    @Field("images")
    private List<String> images;
    
    @Field("available_hours")
    private AvailableHours availableHours;
    
    @Field("booking_settings")
    private BookingSettings bookingSettings;
    
    @Field("utilization_rate")
    private Double utilizationRate = 0.0;
    
    @Field("total_bookings")
    private Integer totalBookings = 0;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    @Field("created_by")
    private String createdBy;
    
    @Field("updated_by")
    private String updatedBy;
    
    // Inner classes for complex data
    public static class AvailableHours {
        private String monday;
        private String tuesday;
        private String wednesday;
        private String thursday;
        private String friday;
        private String saturday;
        private String sunday;
        
        // Getters and setters
        public String getMonday() { return monday; }
        public void setMonday(String monday) { this.monday = monday; }
        public String getTuesday() { return tuesday; }
        public void setTuesday(String tuesday) { this.tuesday = tuesday; }
        public String getWednesday() { return wednesday; }
        public void setWednesday(String wednesday) { this.wednesday = wednesday; }
        public String getThursday() { return thursday; }
        public void setThursday(String thursday) { this.thursday = thursday; }
        public String getFriday() { return friday; }
        public void setFriday(String friday) { this.friday = friday; }
        public String getSaturday() { return saturday; }
        public void setSaturday(String saturday) { this.saturday = saturday; }
        public String getSunday() { return sunday; }
        public void setSunday(String sunday) { this.sunday = sunday; }
    }
    
    public static class BookingSettings {
        private Boolean requiresApproval = false;
        private Integer maxBookingDuration = 120; // minutes
        private Integer maxAdvanceBooking = 30; // days
        private Integer minAdvanceBooking = 0; // days
        private Boolean allowRecurring = false;
        private Integer maxRecurringBookings = 10;
        
        // Getters and setters
        public Boolean getRequiresApproval() { return requiresApproval; }
        public void setRequiresApproval(Boolean requiresApproval) { this.requiresApproval = requiresApproval; }
        public Integer getMaxBookingDuration() { return maxBookingDuration; }
        public void setMaxBookingDuration(Integer maxBookingDuration) { this.maxBookingDuration = maxBookingDuration; }
        public Integer getMaxAdvanceBooking() { return maxAdvanceBooking; }
        public void setMaxAdvanceBooking(Integer maxAdvanceBooking) { this.maxAdvanceBooking = maxAdvanceBooking; }
        public Integer getMinAdvanceBooking() { return minAdvanceBooking; }
        public void setMinAdvanceBooking(Integer minAdvanceBooking) { this.minAdvanceBooking = minAdvanceBooking; }
        public Boolean getAllowRecurring() { return allowRecurring; }
        public void setAllowRecurring(Boolean allowRecurring) { this.allowRecurring = allowRecurring; }
        public Integer getMaxRecurringBookings() { return maxRecurringBookings; }
        public void setMaxRecurringBookings(Integer maxRecurringBookings) { this.maxRecurringBookings = maxRecurringBookings; }
    }
    
    // Constructors
    public Facility() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getSubtype() { return subtype; }
    public void setSubtype(String subtype) { this.subtype = subtype; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }
    
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    
    public List<String> getEquipment() { return equipment; }
    public void setEquipment(List<String> equipment) { this.equipment = equipment; }
    
    public List<String> getRules() { return rules; }
    public void setRules(List<String> rules) { this.rules = rules; }
    
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    
    public AvailableHours getAvailableHours() { return availableHours; }
    public void setAvailableHours(AvailableHours availableHours) { this.availableHours = availableHours; }
    
    public BookingSettings getBookingSettings() { return bookingSettings; }
    public void setBookingSettings(BookingSettings bookingSettings) { this.bookingSettings = bookingSettings; }
    
    public Double getUtilizationRate() { return utilizationRate; }
    public void setUtilizationRate(Double utilizationRate) { this.utilizationRate = utilizationRate; }
    
    public Integer getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Integer totalBookings) { this.totalBookings = totalBookings; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    
    // Pre-update method
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
