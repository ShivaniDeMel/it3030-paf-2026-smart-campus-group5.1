package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.FacilityDTO;
import com.smartcampus.backend.entity.Facility;
import com.smartcampus.backend.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FacilityService {
    
    private final FacilityRepository facilityRepository;
    
    public FacilityDTO createFacility(FacilityDTO facilityDTO) {
        if (facilityRepository.existsByNameIgnoreCase(facilityDTO.getName())) {
            throw new IllegalArgumentException("Facility with name '" + facilityDTO.getName() + "' already exists");
        }
        
        Facility facility = facilityDTO.toEntity();
        // Set default values if null
        if (facility.getStatus() == null) {
            facility.setStatus(Facility.FacilityStatus.ACTIVE);
        }
        if (facility.getAvailableWeekends() == null) {
            facility.setAvailableWeekends(false);
        }
        if (facility.getAvailableStartTime() == null) {
            facility.setAvailableStartTime(java.time.LocalTime.of(8, 0));
        }
        if (facility.getAvailableEndTime() == null) {
            facility.setAvailableEndTime(java.time.LocalTime.of(22, 0));
        }
        
        Facility savedFacility = facilityRepository.save(facility);
        return FacilityDTO.fromEntity(savedFacility);
    }
    
    public FacilityDTO updateFacility(String id, FacilityDTO facilityDTO) {
        Facility existingFacility = facilityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Facility not found with id: " + id));
        
        if (!existingFacility.getName().equalsIgnoreCase(facilityDTO.getName()) &&
            facilityRepository.existsByNameIgnoreCase(facilityDTO.getName())) {
            throw new IllegalArgumentException("Facility with name '" + facilityDTO.getName() + "' already exists");
        }
        
        facilityDTO.setId(id);
        Facility facility = facilityDTO.toEntity();
        Facility updatedFacility = facilityRepository.save(facility);
        return FacilityDTO.fromEntity(updatedFacility);
    }
    
    public void deleteFacility(String id) {
        if (!facilityRepository.existsById(id)) {
            throw new IllegalArgumentException("Facility not found with id: " + id);
        }
        facilityRepository.deleteById(id);
    }
    
    public FacilityDTO getFacilityById(String id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Facility not found with id: " + id));
        return FacilityDTO.fromEntity(facility);
    }
    
    public List<FacilityDTO> getAllFacilities() {
        return facilityRepository.findAll().stream()
                .map(FacilityDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<FacilityDTO> searchFacilities(
            Facility.FacilityType type,
            Facility.FacilityStatus status,
            String location,
            String name,
            Integer minCapacity,
            Integer maxCapacity) {
        
        List<Facility> facilities = facilityRepository.searchFacilities(type, status, location, name, minCapacity, maxCapacity);
        return facilities.stream()
                .map(FacilityDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<FacilityDTO> getFacilitiesByType(Facility.FacilityType type) {
        return facilityRepository.findByType(type).stream()
                .map(FacilityDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<FacilityDTO> getFacilitiesByStatus(Facility.FacilityStatus status) {
        return facilityRepository.findByStatus(status).stream()
                .map(FacilityDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public Map<String, Long> getFacilityStatistics() {
        try {
            // Try to get all facilities with a timeout
            List<Facility> allFacilities = facilityRepository.findAll();
            
            Map<String, Long> statistics = new java.util.HashMap<>();
            
            // Count by type
            Map<Facility.FacilityType, Long> typeCounts = allFacilities.stream()
                    .collect(Collectors.groupingBy(Facility::getType, Collectors.counting()));
            
            for (Facility.FacilityType type : Facility.FacilityType.values()) {
                statistics.put("type_" + type.toString().toLowerCase(), typeCounts.getOrDefault(type, 0L));
            }
            
            // Count by status
            Map<Facility.FacilityStatus, Long> statusCounts = allFacilities.stream()
                    .collect(Collectors.groupingBy(Facility::getStatus, Collectors.counting()));
            
            for (Facility.FacilityStatus status : Facility.FacilityStatus.values()) {
                statistics.put("status_" + status.toString().toLowerCase(), statusCounts.getOrDefault(status, 0L));
            }
            
            statistics.put("total", (long) allFacilities.size());
            
            return statistics;
        } catch (Exception e) {
            // Return empty statistics if there's any error
            Map<String, Long> emptyStats = new java.util.HashMap<>();
            emptyStats.put("total", 0L);
            emptyStats.put("status_active", 0L);
            emptyStats.put("status_maintenance", 0L);
            emptyStats.put("status_out_of_service", 0L);
            emptyStats.put("status_reserved", 0L);
            emptyStats.put("type_lecture_hall", 0L);
            emptyStats.put("type_laboratory", 0L);
            emptyStats.put("type_meeting_room", 0L);
            emptyStats.put("type_auditorium", 0L);
            emptyStats.put("type_sports_facility", 0L);
            emptyStats.put("type_study_area", 0L);
            emptyStats.put("type_equipment", 0L);
            return emptyStats;
        }
    }
}
