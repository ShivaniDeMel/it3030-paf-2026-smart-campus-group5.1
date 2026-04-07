package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
    
    List<Facility> findByType(Facility.FacilityType type);
    
    List<Facility> findByStatus(Facility.FacilityStatus status);
    
    List<Facility> findByLocationContainingIgnoreCase(String location);
    
    List<Facility> findByNameContainingIgnoreCase(String name);
    
    @Query("{ '$and': [ " +
           "{ '$or': [ { 'type': ?0 }, { 'type': null } ] }, " +
           "{ '$or': [ { 'status': ?1 }, { 'status': null } ] }, " +
           "{ '$or': [ { 'location': { '$regex': ?2, '$options': 'i' } }, { 'location': null } ] }, " +
           "{ '$or': [ { 'name': { '$regex': ?3, '$options': 'i' } }, { 'name': null } ] }, " +
           "{ '$or': [ { 'capacity': { '$gte': ?4 } }, { 'capacity': null } ] }, " +
           "{ '$or': [ { 'capacity': { '$lte': ?5 } }, { 'capacity': null } ] } " +
           "] }")
    List<Facility> searchFacilities(
            @Param("type") Facility.FacilityType type,
            @Param("status") Facility.FacilityStatus status,
            @Param("location") String location,
            @Param("name") String name,
            @Param("minCapacity") Integer minCapacity,
            @Param("maxCapacity") Integer maxCapacity
    );
    
    boolean existsByNameIgnoreCase(String name);
}
