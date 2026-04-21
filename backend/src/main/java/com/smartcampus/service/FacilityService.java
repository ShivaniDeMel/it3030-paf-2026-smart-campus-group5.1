package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.exception.ResourceAlreadyExistsException;
import com.smartcampus.exception.BusinessException;
import com.smartcampus.model.Facility;
import com.smartcampus.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    // Get all facilities
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    // Get facility by ID
    public Facility getFacilityById(@NonNull String id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));
    }

    // Create new facility
    public Facility createFacility(@NonNull Facility facility, String createdBy) {
        // Check if facility with same name and location already exists
        List<Facility> existingFacilities = facilityRepository.findByNameIgnoreCaseAndLocationIgnoreCase(
                facility.getName(), facility.getLocation());
        
        if (!existingFacilities.isEmpty()) {
            throw new ResourceAlreadyExistsException("Facility with name '" + facility.getName() + 
                    "' at location '" + facility.getLocation() + "' already exists");
        }

        facility.setCreatedBy(createdBy);
        facility.setCreatedAt(LocalDateTime.now());
        facility.setUpdatedAt(LocalDateTime.now());
        
        return facilityRepository.save(facility);
    }

    // Update facility
    public Facility updateFacility(@NonNull String id, @NonNull Facility facilityDetails, String updatedBy) {
        Facility existingFacility = getFacilityById(id);
        
        // Update fields
        existingFacility.setName(facilityDetails.getName());
        existingFacility.setType(facilityDetails.getType());
        existingFacility.setSubtype(facilityDetails.getSubtype());
        existingFacility.setLocation(facilityDetails.getLocation());
        existingFacility.setBuilding(facilityDetails.getBuilding());
        existingFacility.setFloor(facilityDetails.getFloor());
        existingFacility.setRoom(facilityDetails.getRoom());
        existingFacility.setCapacity(facilityDetails.getCapacity());
        existingFacility.setStatus(facilityDetails.getStatus());
        existingFacility.setDescription(facilityDetails.getDescription());
        existingFacility.setAmenities(facilityDetails.getAmenities());
        existingFacility.setEquipment(facilityDetails.getEquipment());
        existingFacility.setRules(facilityDetails.getRules());
        existingFacility.setImages(facilityDetails.getImages());
        existingFacility.setAvailableHours(facilityDetails.getAvailableHours());
        existingFacility.setBookingSettings(facilityDetails.getBookingSettings());
        existingFacility.setUpdatedBy(updatedBy);
        existingFacility.setUpdatedAt(LocalDateTime.now());
        
        return facilityRepository.save(existingFacility);
    }

    // Delete facility
    public void deleteFacility(@NonNull String id) {
        Facility facility = getFacilityById(id);
        if (facility == null) {
            throw new IllegalArgumentException("Facility cannot be null");
        }
        facilityRepository.delete(facility);
    }

    // Search facilities with filters
    public List<Facility> searchFacilities(Map<String, String> params) {
        String keyword = params.get("keyword");
        String type = params.get("type");
        String status = params.get("status");
        String building = params.get("building");
        String minCapacity = params.get("minCapacity");
        String maxCapacity = params.get("maxCapacity");

        if (keyword != null && !keyword.trim().isEmpty()) {
            return facilityRepository.searchByKeyword(keyword.trim());
        }

        if (type != null && status != null) {
            return facilityRepository.findByTypeAndStatus(type, status);
        }

        if (type != null) {
            return facilityRepository.findByType(type);
        }

        if (status != null) {
            return facilityRepository.findByStatus(status);
        }

        if (building != null) {
            return facilityRepository.findByBuilding(building);
        }

        if (minCapacity != null && maxCapacity != null) {
            try {
                Integer min = Integer.parseInt(minCapacity);
                Integer max = Integer.parseInt(maxCapacity);
                return facilityRepository.findByCapacityRange(min, max);
            } catch (NumberFormatException e) {
                throw new BusinessException("Invalid capacity values provided");
            }
        }

        return getAllFacilities();
    }

    // Get facilities by type
    public List<Facility> getFacilitiesByType(@NonNull String type) {
        return facilityRepository.findByType(type);
    }

    // Get facilities by status
    public List<Facility> getFacilitiesByStatus(@NonNull String status) {
        return facilityRepository.findByStatus(status);
    }

    // Get facility statistics
    public Map<String, Object> getFacilityStatistics() {
        // Get all facilities in one call instead of multiple database calls
        List<Facility> allFacilities = facilityRepository.findAll();
        long total = allFacilities.size();
        
        // Count by status using stream instead of separate database calls
        long active = allFacilities.stream().mapToLong(f -> f.getStatus() != null && f.getStatus().equalsIgnoreCase("active") ? 1 : 0).sum();
        long maintenance = allFacilities.stream().mapToLong(f -> f.getStatus() != null && f.getStatus().equalsIgnoreCase("maintenance") ? 1 : 0).sum();
        long outOfService = allFacilities.stream().mapToLong(f -> f.getStatus() != null && f.getStatus().equalsIgnoreCase("out_of_service") ? 1 : 0).sum();
        long underReview = allFacilities.stream().mapToLong(f -> f.getStatus() != null && f.getStatus().equalsIgnoreCase("under_review") ? 1 : 0).sum();
        
        // Count by facility type (case-insensitive matching)
        long lectureHall = allFacilities.stream().mapToLong(f -> f.getType() != null && f.getType().toLowerCase().contains("lecture") ? 1 : 0).sum();
        long laboratory = allFacilities.stream().mapToLong(f -> f.getType() != null && f.getType().toLowerCase().contains("laboratory") ? 1 : 0).sum();
        long meetingRoom = allFacilities.stream().mapToLong(f -> f.getType() != null && f.getType().toLowerCase().contains("meeting") ? 1 : 0).sum();
        long auditorium = allFacilities.stream().mapToLong(f -> f.getType() != null && f.getType().toLowerCase().contains("auditorium") ? 1 : 0).sum();
        long sportsFacility = allFacilities.stream().mapToLong(f -> f.getType() != null && f.getType().toLowerCase().contains("sports") ? 1 : 0).sum();
        long studyArea = allFacilities.stream().mapToLong(f -> f.getType() != null && f.getType().toLowerCase().contains("study") ? 1 : 0).sum();
        long equipment = allFacilities.stream().mapToLong(f -> f.getType() != null && f.getType().toLowerCase().contains("equipment") ? 1 : 0).sum();
        
        // Calculate utilization rate from already fetched facilities
        double totalUtilization = allFacilities.stream()
                .mapToDouble(f -> f.getUtilizationRate() != null ? f.getUtilizationRate() : 0.0)
                .sum();
        double averageUtilization = total > 0 ? totalUtilization / total : 0.0;

        Map<String, Object> statistics = new java.util.HashMap<>();
        statistics.put("total", total);
        statistics.put("status_active", active);
        statistics.put("status_maintenance", maintenance);
        statistics.put("status_out_of_service", outOfService);
        statistics.put("status_under_review", underReview);
        statistics.put("type_lecture_hall", lectureHall);
        statistics.put("type_laboratory", laboratory);
        statistics.put("type_meeting_room", meetingRoom);
        statistics.put("type_auditorium", auditorium);
        statistics.put("type_sports_facility", sportsFacility);
        statistics.put("type_study_area", studyArea);
        statistics.put("type_equipment", equipment);
        statistics.put("utilization_rate", Math.round(averageUtilization));
        statistics.put("booking_trends", Map.of(
                "daily", List.of(12, 15, 18, 14, 20),
                "weekly", List.of(85, 92, 78, 95, 88)
        ));
        
        return statistics;
    }

    // Get facility types
    public List<String> getFacilityTypes() {
        // Always return all facility types
        return Arrays.asList(
            "lecture_hall",
            "laboratory", 
            "meeting_room",
            "auditorium",
            "sports_facility",
            "study_area",
            "equipment"
        );
    }

    // Get facility statuses
    public List<String> getFacilityStatuses() {
        return facilityRepository.findDistinctStatuses().stream()
                .map(Facility::getStatus)
                .distinct()
                .collect(Collectors.toList());
    }

    // Update facility utilization rate
    public void updateFacilityUtilization(@NonNull String facilityId, double utilizationRate) {
        Facility facility = getFacilityById(facilityId);
        facility.setUtilizationRate(utilizationRate);
        facility.setUpdatedAt(LocalDateTime.now());
        facilityRepository.save(facility);
    }

    // Increment booking count
    public void incrementBookingCount(@NonNull String facilityId) {
        Facility facility = getFacilityById(facilityId);
        facility.setTotalBookings(facility.getTotalBookings() + 1);
        facility.setUpdatedAt(LocalDateTime.now());
        facilityRepository.save(facility);
    }
}
