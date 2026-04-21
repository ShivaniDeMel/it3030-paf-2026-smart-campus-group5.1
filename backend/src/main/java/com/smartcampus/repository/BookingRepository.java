package com.smartcampus.repository;

import com.smartcampus.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Find bookings by user ID
    List<Booking> findByUserId(String userId);
    
    // Find bookings by facility ID
    List<Booking> findByFacilityId(String facilityId);
    
    // Find bookings by status
    List<Booking> findByStatus(String status);
    
    // Find bookings by user and status
    List<Booking> findByUserIdAndStatus(String userId, String status);
    
    // Find bookings by facility and status
    List<Booking> findByFacilityIdAndStatus(String facilityId, String status);
    
    // Find bookings in a time range for a facility
    @Query("{'facilityId': ?0, 'status': {$ne: 'cancelled'}, $or: [{'startTime': {$lt: ?2}, 'endTime': {$gt: ?1}}, {'startTime': {$gte: ?1, $lt: ?2}}, {'endTime': {$gt: ?1, $lte: ?2}}]}")
    List<Booking> findConflictingBookings(String facilityId, LocalDateTime startTime, LocalDateTime endTime);
    
    // Find bookings for a specific date
    @Query("{'startTime': {$gte: ?0, $lt: ?1}, 'status': {$ne: 'cancelled'}}")
    List<Booking> findBookingsByDate(LocalDateTime startOfDay, LocalDateTime endOfDay);
    
    // Find upcoming bookings for a user
    @Query("{'userId': ?0, 'startTime': {$gt: ?1}, 'status': {$ne: 'cancelled'}}")
    List<Booking> findUpcomingBookings(String userId, LocalDateTime now);
    
    // Find past bookings for a user
    @Query("{'userId': ?0, 'endTime': {$lt: ?1}, 'status': {$ne: 'cancelled'}}")
    List<Booking> findPastBookings(String userId, LocalDateTime now);
    
    // Find bookings that require approval
    List<Booking> findByStatusAndFacilityId(String status, String facilityId);
    
    // Count bookings by status
    Long countByStatus(String status);
    
    // Count bookings by user
    Long countByUserId(String userId);
    
    // Count bookings by facility
    Long countByFacilityId(String facilityId);
    
    // Find bookings created by specific user
    List<Booking> findByCreatedBy(String createdBy);
    
    // Find bookings updated by specific user
    List<Booking> findByUpdatedBy(String updatedBy);
    
    // Get booking statistics
    @Query(value = "{}", count = true)
    Long getTotalBookings();
    
    // Find bookings in time range
    @Query("{'startTime': {$gte: ?0, $lte: ?1}, 'status': {$ne: 'cancelled'}}")
    List<Booking> findBookingsInTimeRange(LocalDateTime startTime, LocalDateTime endTime);
    
    // Find active bookings for facility
    @Query("{'facilityId': ?0, 'status': 'confirmed', 'startTime': {$lte: ?1}, 'endTime': {$gt: ?1}}")
    List<Booking> findActiveBookingsForFacility(String facilityId, LocalDateTime currentTime);
}
