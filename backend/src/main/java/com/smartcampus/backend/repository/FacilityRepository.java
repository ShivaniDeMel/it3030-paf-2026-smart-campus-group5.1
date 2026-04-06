package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    
    List<Facility> findByType(Facility.FacilityType type);
    
    List<Facility> findByStatus(Facility.FacilityStatus status);
    
    List<Facility> findByLocationContainingIgnoreCase(String location);
    
    List<Facility> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT f FROM Facility f WHERE " +
           "(:type IS NULL OR f.type = :type) AND " +
           "(:status IS NULL OR f.status = :status) AND " +
           "(:location IS NULL OR LOWER(f.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:name IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:minCapacity IS NULL OR f.capacity >= :minCapacity) AND " +
           "(:maxCapacity IS NULL OR f.capacity <= :maxCapacity)")
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
