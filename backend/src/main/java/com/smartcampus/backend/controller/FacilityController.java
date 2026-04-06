package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.FacilityDTO;
import com.smartcampus.backend.entity.Facility;
import com.smartcampus.backend.service.FacilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FacilityController {
    
    private final FacilityService facilityService;
    
    @PostMapping
    public ResponseEntity<FacilityDTO> createFacility(@Valid @RequestBody FacilityDTO facilityDTO) {
        try {
            FacilityDTO createdFacility = facilityService.createFacility(facilityDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFacility);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FacilityDTO> getFacility(@PathVariable String id) {
        try {
            Long facilityId = Long.parseLong(id);
            FacilityDTO facility = facilityService.getFacilityById(facilityId);
            return ResponseEntity.ok(facility);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<FacilityDTO>> getAllFacilities() {
        try {
            List<FacilityDTO> facilities = facilityService.getAllFacilities();
            return ResponseEntity.ok(facilities);
        } catch (Exception e) {
            // Return empty list if MongoDB is not available
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<FacilityDTO> updateFacility(
            @PathVariable String id,
            @Valid @RequestBody FacilityDTO facilityDTO) {
        try {
            Long facilityId = Long.parseLong(id);
            FacilityDTO updatedFacility = facilityService.updateFacility(facilityId, facilityDTO);
            return ResponseEntity.ok(updatedFacility);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        try {
            Long facilityId = Long.parseLong(id);
            facilityService.deleteFacility(facilityId);
            return ResponseEntity.noContent().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<FacilityDTO>> searchFacilities(
            @RequestParam(required = false) Facility.FacilityType type,
            @RequestParam(required = false) Facility.FacilityStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity) {
        try {
            List<FacilityDTO> facilities = facilityService.searchFacilities(
                    type, status, location, name, minCapacity, maxCapacity);
            return ResponseEntity.ok(facilities);
        } catch (Exception e) {
            // Return empty list if MongoDB is not available
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<FacilityDTO>> getFacilitiesByType(@PathVariable Facility.FacilityType type) {
        try {
            List<FacilityDTO> facilities = facilityService.getFacilitiesByType(type);
            return ResponseEntity.ok(facilities);
        } catch (Exception e) {
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FacilityDTO>> getFacilitiesByStatus(@PathVariable Facility.FacilityStatus status) {
        try {
            List<FacilityDTO> facilities = facilityService.getFacilitiesByStatus(status);
            return ResponseEntity.ok(facilities);
        } catch (Exception e) {
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new java.util.HashMap<>();
        response.put("status", "UP");
        response.put("message", "Smart Campus Backend is running");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getFacilityStatistics() {
        // Return empty statistics immediately for now to prevent timeouts
        // This will be updated once MongoDB connection is stable
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
        
        return ResponseEntity.ok()
                .header("Cache-Control", "no-cache, no-store, must-revalidate")
                .header("Pragma", "no-cache")
                .header("Expires", "0")
                .body(emptyStats);
    }
    
    @GetMapping("/types")
    public ResponseEntity<Facility.FacilityType[]> getFacilityTypes() {
        return ResponseEntity.ok(Facility.FacilityType.values());
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<Facility.FacilityStatus[]> getFacilityStatuses() {
        return ResponseEntity.ok(Facility.FacilityStatus.values());
    }
}
