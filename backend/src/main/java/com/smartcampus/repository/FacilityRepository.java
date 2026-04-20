package com.smartcampus.repository;

import com.smartcampus.model.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
    
    // Find facilities by type
    List<Facility> findByType(String type);
    
    // Find facilities by status
    List<Facility> findByStatus(String status);
    
    // Find facilities by type and status
    List<Facility> findByTypeAndStatus(String type, String status);
    
    // Find facilities by building
    List<Facility> findByBuilding(String building);
    
    // Find facilities by capacity range
    @Query("{'capacity': { $gte: ?0, $lte: ?1 }}")
    List<Facility> findByCapacityRange(Integer minCapacity, Integer maxCapacity);
    
    // Search facilities by name or description (case insensitive)
    @Query("{$or: [{'name': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}]}")
    List<Facility> searchByKeyword(String keyword);
    
    // Find facilities with specific amenities
    @Query("{'amenities': {$in: ?0}}")
    List<Facility> findByAmenitiesIn(List<String> amenities);
    
    // Find facilities with specific equipment
    @Query("{'equipment': {$in: ?0}}")
    List<Facility> findByEquipmentIn(List<String> equipment);
    
    // Get distinct facility types
    @Query(value = "{}", fields = "{'type': 1}")
    List<Facility> findDistinctTypes();
    
    // Get distinct facility statuses
    @Query(value = "{}", fields = "{'status': 1}")
    List<Facility> findDistinctStatuses();
    
    // Count facilities by type
    Long countByType(String type);
    
    // Count facilities by status
    Long countByStatus(String status);
    
    // Find facilities created by specific user
    List<Facility> findByCreatedBy(String createdBy);
    
    // Find facilities updated by specific user
    List<Facility> findByUpdatedBy(String updatedBy);
    
    // Find facilities by name and location (case insensitive)
    @Query("{'name': {$regex: ?0, $options: 'i'}, 'location': {$regex: ?1, $options: 'i'}}")
    List<Facility> findByNameIgnoreCaseAndLocationIgnoreCase(String name, String location);
    
    // Get facility statistics
    @Query(value = "{}", count = true)
    Long getTotalFacilities();
    
    // Find active facilities with booking allowed
    @Query("{'status': 'active', 'booking_settings.requiresApproval': ?0}")
    List<Facility> findActiveFacilitiesByApprovalRequired(Boolean requiresApproval);
}
