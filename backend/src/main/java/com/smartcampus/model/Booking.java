package com.smartcampus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "bookings")
public class Booking {
    
    @Id
    private String id;
    
    @NotNull(message = "Facility ID is required")
    @Field("facility_id")
    private String facilityId;
    
    @NotNull(message = "User ID is required")
    @Field("user_id")
    private String userId;
    
    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    @Field("start_time")
    private LocalDateTime startTime;
    
    @NotNull(message = "End time is required")
    @Field("end_time")
    private LocalDateTime endTime;
    
    @Field("purpose")
    private String purpose;
    
    @Field("attendee_count")
    private Integer attendeeCount;
    
    @Field("status")
    private String status = "pending"; // pending, confirmed, cancelled, completed
    
    @Field("booking_type")
    private String bookingType = "single"; // single, recurring
    
    @Field("recurring_pattern")
    private RecurringPattern recurringPattern;
    
    @Field("special_requirements")
    private List<String> specialRequirements;
    
    @Field("equipment_requested")
    private List<String> equipmentRequested;
    
    @Field("approval_notes")
    private String approvalNotes;
    
    @Field("cancellation_reason")
    private String cancellationReason;
    
    @Field("cancelled_by")
    private String cancelledBy;
    
    @Field("cancelled_at")
    private LocalDateTime cancelledAt;
    
    @Field("approved_by")
    private String approvedBy;
    
    @Field("approved_at")
    private LocalDateTime approvedAt;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    @Field("created_by")
    private String createdBy;
    
    @Field("updated_by")
    private String updatedBy;
    
    @Field("facility_details")
    private FacilityDetails facilityDetails;
    
    @Field("user_details")
    private UserDetails userDetails;
    
    // Inner classes
    public static class RecurringPattern {
        private String frequency; // daily, weekly, monthly
        private Integer interval;
        private LocalDateTime endDate;
        private List<String> daysOfWeek; // For weekly recurring
        private Integer dayOfMonth; // For monthly recurring
        
        // Getters and setters
        public String getFrequency() { return frequency; }
        public void setFrequency(String frequency) { this.frequency = frequency; }
        public Integer getInterval() { return interval; }
        public void setInterval(Integer interval) { this.interval = interval; }
        public LocalDateTime getEndDate() { return endDate; }
        public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
        public List<String> getDaysOfWeek() { return daysOfWeek; }
        public void setDaysOfWeek(List<String> daysOfWeek) { this.daysOfWeek = daysOfWeek; }
        public Integer getDayOfMonth() { return dayOfMonth; }
        public void setDayOfMonth(Integer dayOfMonth) { this.dayOfMonth = dayOfMonth; }
    }
    
    public static class FacilityDetails {
        private String name;
        private String type;
        private String location;
        private Integer capacity;
        
        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public Integer getCapacity() { return capacity; }
        public void setCapacity(Integer capacity) { this.capacity = capacity; }
    }
    
    public static class UserDetails {
        private String name;
        private String email;
        private String role;
        
        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
    
    // Constructors
    public Booking() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getFacilityId() { return facilityId; }
    public void setFacilityId(String facilityId) { this.facilityId = facilityId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    
    public Integer getAttendeeCount() { return attendeeCount; }
    public void setAttendeeCount(Integer attendeeCount) { this.attendeeCount = attendeeCount; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }
    
    public RecurringPattern getRecurringPattern() { return recurringPattern; }
    public void setRecurringPattern(RecurringPattern recurringPattern) { this.recurringPattern = recurringPattern; }
    
    public List<String> getSpecialRequirements() { return specialRequirements; }
    public void setSpecialRequirements(List<String> specialRequirements) { this.specialRequirements = specialRequirements; }
    
    public List<String> getEquipmentRequested() { return equipmentRequested; }
    public void setEquipmentRequested(List<String> equipmentRequested) { this.equipmentRequested = equipmentRequested; }
    
    public String getApprovalNotes() { return approvalNotes; }
    public void setApprovalNotes(String approvalNotes) { this.approvalNotes = approvalNotes; }
    
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    
    public String getCancelledBy() { return cancelledBy; }
    public void setCancelledBy(String cancelledBy) { this.cancelledBy = cancelledBy; }
    
    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }
    
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    
    public FacilityDetails getFacilityDetails() { return facilityDetails; }
    public void setFacilityDetails(FacilityDetails facilityDetails) { this.facilityDetails = facilityDetails; }
    
    public UserDetails getUserDetails() { return userDetails; }
    public void setUserDetails(UserDetails userDetails) { this.userDetails = userDetails; }
    
    // Business logic methods
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isActive() {
        return "confirmed".equals(status) || "pending".equals(status);
    }
    
    public boolean isCancelled() {
        return "cancelled".equals(status);
    }
    
    public boolean isCompleted() {
        return "completed".equals(status);
    }
}
