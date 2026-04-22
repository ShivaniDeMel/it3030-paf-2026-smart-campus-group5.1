package com.smartcampus.controller;

import com.smartcampus.model.Facility;
import com.smartcampus.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    // Get all facilities
    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities() {
        List<Facility> facilities = facilityService.getAllFacilities();
        return ResponseEntity.ok(facilities);
    }

    // Get facility by ID
    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@NonNull @PathVariable String id) {
        Facility facility = facilityService.getFacilityById(id);
        return ResponseEntity.ok(facility);
    }

    // Create new facility
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Facility> createFacility(@RequestParam Map<String, String> facilityData,
                                                  @RequestParam(required = false) MultipartFile image) {
        // Create facility object from form data
        Facility facility = new Facility();
        facility.setName(facilityData.get("name"));
        facility.setType(facilityData.get("type"));
        facility.setCapacity(Integer.parseInt(facilityData.get("capacity")));
        facility.setLocation(facilityData.get("location"));
        facility.setDescription(facilityData.get("description"));
        facility.setStatus(facilityData.get("status"));
        
        // Handle image if provided
        if (image != null && !image.isEmpty()) {
            try {
                // For now, we'll store the image as a base64 string in the images list
                // In production, you'd upload to a file storage service
                byte[] imageBytes = image.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                String imageDataUrl = "data:" + image.getContentType() + ";base64," + base64Image;
                facility.setImages(List.of(imageDataUrl));
            } catch (Exception e) {
                throw new RuntimeException("Failed to process image", e);
            }
        }
        
        // For now, we'll use a default user ID. In a real app, this would come from authentication
        String createdBy = "admin";
        Facility createdFacility = facilityService.createFacility(facility, createdBy);
        return new ResponseEntity<>(createdFacility, HttpStatus.CREATED);
    }

    // Update facility
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Facility> updateFacility(@NonNull @PathVariable String id,
                                                   @RequestParam Map<String, String> facilityData,
                                                   @RequestParam(required = false) MultipartFile image) {
        // Get existing facility
        Facility existingFacility = facilityService.getFacilityById(id);
        
        // Update facility fields
        existingFacility.setName(facilityData.get("name"));
        existingFacility.setType(facilityData.get("type"));
        existingFacility.setCapacity(Integer.parseInt(facilityData.get("capacity")));
        existingFacility.setLocation(facilityData.get("location"));
        existingFacility.setDescription(facilityData.get("description"));
        existingFacility.setStatus(facilityData.get("status"));
        
        // Handle image if provided
        if (image != null && !image.isEmpty()) {
            try {
                // Convert image to base64 data URL
                byte[] imageBytes = image.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                String imageDataUrl = "data:" + image.getContentType() + ";base64," + base64Image;
                existingFacility.setImages(List.of(imageDataUrl));
            } catch (Exception e) {
                throw new RuntimeException("Failed to process image", e);
            }
        }
        
        // For now, we'll use a default user ID. In a real app, this would come from authentication
        String updatedBy = "admin";
        Facility updatedFacility = facilityService.updateFacility(id, existingFacility, updatedBy);
        return ResponseEntity.ok(updatedFacility);
    }

    // Delete facility
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@NonNull @PathVariable String id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }

    // Search facilities with filters
    @GetMapping("/search")
    public ResponseEntity<List<Facility>> searchFacilities(@RequestParam Map<String, String> params) {
        List<Facility> facilities = facilityService.searchFacilities(params);
        return ResponseEntity.ok(facilities);
    }

    // Get facilities by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Facility>> getFacilitiesByType(@NonNull @PathVariable String type) {
        List<Facility> facilities = facilityService.getFacilitiesByType(type);
        return ResponseEntity.ok(facilities);
    }

    // Get facilities by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Facility>> getFacilitiesByStatus(@NonNull @PathVariable String status) {
        List<Facility> facilities = facilityService.getFacilitiesByStatus(status);
        return ResponseEntity.ok(facilities);
    }

    // Get facility statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getFacilityStatistics() {
        Map<String, Object> statistics = facilityService.getFacilityStatistics();
        return ResponseEntity.ok(statistics);
    }

    // Get facility types
    @GetMapping("/types")
    public ResponseEntity<List<String>> getFacilityTypes() {
        List<String> types = facilityService.getFacilityTypes();
        return ResponseEntity.ok(types);
    }

    // Get facility statuses
    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getFacilityStatuses() {
        List<String> statuses = facilityService.getFacilityStatuses();
        return ResponseEntity.ok(statuses);
    }
}
