package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.exception.ResourceAlreadyExistsException;
import com.smartcampus.exception.BusinessException;
import com.smartcampus.model.Booking;
import com.smartcampus.model.Facility;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.annotation.Nonnull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private FacilityRepository facilityRepository;

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get booking by ID
    public Booking getBookingById(@Nonnull String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    // Create new booking
    public Booking createBooking(@Nonnull Booking booking, @Nonnull String createdBy) {
        // Validate facility exists and is available
        String facilityId = booking.getFacilityId();
        if (facilityId == null) {
            throw new IllegalArgumentException("Facility ID cannot be null");
        }
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + facilityId));

        if (facility.getStatus() == null || !"active".equalsIgnoreCase(facility.getStatus())) {
            throw new BusinessException("Facility is not available for booking");
        }

        // Check for time conflicts
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                booking.getFacilityId(), booking.getStartTime(), booking.getEndTime());

        if (!conflictingBookings.isEmpty()) {
            throw new ResourceAlreadyExistsException("Time slot is already booked for this facility");
        }

        // Set booking metadata
        booking.setCreatedBy(createdBy);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        
        // Set status based on facility requirements
        if (facility.getBookingSettings() != null && facility.getBookingSettings().getRequiresApproval()) {
            booking.setStatus("pending");
        } else {
            booking.setStatus("confirmed");
        }

        return bookingRepository.save(booking);
    }

    // Update booking
    public Booking updateBooking(@Nonnull String id, @Nonnull Booking bookingDetails, String updatedBy) {
        Booking existingBooking = getBookingById(id);

        // Only allow updates if booking is pending or confirmed
        if (!"pending".equals(existingBooking.getStatus()) && !"confirmed".equals(existingBooking.getStatus())) {
            throw new BusinessException("Cannot update booking that is " + existingBooking.getStatus());
        }

        // Update fields
        existingBooking.setFacilityId(bookingDetails.getFacilityId());
        existingBooking.setUserId(bookingDetails.getUserId());
        existingBooking.setStartTime(bookingDetails.getStartTime());
        existingBooking.setEndTime(bookingDetails.getEndTime());
        existingBooking.setPurpose(bookingDetails.getPurpose());
        existingBooking.setAttendeeCount(bookingDetails.getAttendeeCount());
        existingBooking.setSpecialRequirements(bookingDetails.getSpecialRequirements());
        existingBooking.setEquipmentRequested(bookingDetails.getEquipmentRequested());
        existingBooking.setUpdatedBy(updatedBy);
        existingBooking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(existingBooking);
    }

    // Delete booking
    public void deleteBooking(@Nonnull String id) {
        Booking booking = getBookingById(id);
        
        // Only allow deletion if booking is pending or cancelled
        if (!"pending".equals(booking.getStatus()) && !"cancelled".equals(booking.getStatus())) {
            throw new BusinessException("Cannot delete booking that is " + booking.getStatus());
        }
        
        bookingRepository.delete(booking);
    }

    // Cancel booking
    public Booking cancelBooking(@Nonnull String id, String reason, String cancelledBy) {
        Booking booking = getBookingById(id);
        
        if (booking.isCancelled()) {
            throw new BusinessException("Booking is already cancelled");
        }

        if (booking.isCompleted()) {
            throw new BusinessException("Cannot cancel completed booking");
        }

        booking.setStatus("cancelled");
        booking.setCancellationReason(reason);
        booking.setCancelledBy(cancelledBy);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Approve booking
    public Booking approveBooking(@Nonnull String id, String notes, String approvedBy) {
        Booking booking = getBookingById(id);
        
        if (!"pending".equals(booking.getStatus())) {
            throw new BusinessException("Only pending bookings can be approved");
        }

        booking.setStatus("confirmed");
        booking.setApprovalNotes(notes);
        booking.setApprovedBy(approvedBy);
        booking.setApprovedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Reject booking with reason (admin flow)
    public Booking rejectBooking(@Nonnull String id, String reason, String rejectedBy) {
        Booking booking = getBookingById(id);

        if (!"pending".equals(booking.getStatus())) {
            throw new BusinessException("Only pending bookings can be rejected");
        }

        booking.setStatus("cancelled");
        booking.setCancellationReason(reason);
        booking.setCancelledBy(rejectedBy);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Get bookings by user
    public List<Booking> getBookingsByUser(@Nonnull String userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Get bookings by facility
    public List<Booking> getBookingsByFacility(@Nonnull String facilityId) {
        return bookingRepository.findByFacilityId(facilityId);
    }

    // Get bookings by status
    public List<Booking> getBookingsByStatus(@Nonnull String status) {
        return bookingRepository.findByStatus(status);
    }

    // Get upcoming bookings for user
    public List<Booking> getUpcomingBookingsForUser(@Nonnull String userId) {
        return bookingRepository.findUpcomingBookings(userId, LocalDateTime.now());
    }

    // Get past bookings for user
    public List<Booking> getPastBookingsForUser(@Nonnull String userId) {
        return bookingRepository.findPastBookings(userId, LocalDateTime.now());
    }

    // Get bookings by date
    public List<Booking> getBookingsByDate(LocalDateTime startOfDay, LocalDateTime endOfDay) {
        return bookingRepository.findBookingsByDate(startOfDay, endOfDay);
    }

    // Check availability
    public Map<String, Object> checkAvailability(@Nonnull String facilityId, 
                                                  LocalDateTime startTime, LocalDateTime endTime) {
        // Validate facility exists
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + facilityId));

        // Check for conflicts
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(facilityId, startTime, endTime);

        return Map.of(
                "available", conflictingBookings.isEmpty(),
                "conflicts", conflictingBookings.size(),
                "facility", Map.of(
                        "id", facility.getId(),
                        "name", facility.getName(),
                        "capacity", facility.getCapacity()
                )
        );
    }

    // Get booking statistics
    public Map<String, Object> getBookingStatistics() {
        long total = bookingRepository.count();
        long pending = bookingRepository.countByStatus("pending");
        long confirmed = bookingRepository.countByStatus("confirmed");
        long cancelled = bookingRepository.countByStatus("cancelled");
        long completed = bookingRepository.countByStatus("completed");

        return Map.of(
                "total", total,
                "pending", pending,
                "confirmed", confirmed,
                "cancelled", cancelled,
                "completed", completed
        );
    }
}
