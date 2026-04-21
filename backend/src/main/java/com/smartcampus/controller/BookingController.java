package com.smartcampus.controller;

import com.smartcampus.model.Booking;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@NonNull @PathVariable String id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    // Create new booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @NonNull @RequestBody Booking booking) {
        String createdBy = "admin"; // In real app, get from authentication
        Booking createdBooking = bookingService.createBooking(booking, createdBy);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    // Update booking
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@NonNull @PathVariable String id, 
                                                 @Valid @NonNull @RequestBody Booking bookingDetails) {
        String updatedBy = "admin"; // In real app, get from authentication
        Booking updatedBooking = bookingService.updateBooking(id, bookingDetails, updatedBy);
        return ResponseEntity.ok(updatedBooking);
    }

    // Delete booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@NonNull @PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    // Cancel booking
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@NonNull @PathVariable String id, 
                                                  @RequestBody Map<String, String> request) {
        String cancelledBy = "admin"; // In real app, get from authentication
        String reason = request.get("reason");
        Booking cancelledBooking = bookingService.cancelBooking(id, reason, cancelledBy);
        return ResponseEntity.ok(cancelledBooking);
    }

    // Approve booking
    @PostMapping("/{id}/approve")
    public ResponseEntity<Booking> approveBooking(@NonNull @PathVariable String id, 
                                                   @RequestBody Map<String, String> request) {
        String approvedBy = "admin"; // In real app, get from authentication
        String notes = request.get("notes");
        Booking approvedBooking = bookingService.approveBooking(id, notes, approvedBy);
        return ResponseEntity.ok(approvedBooking);
    }

    // Get bookings by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@NonNull @PathVariable String userId) {
        List<Booking> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }

    // Get bookings by facility
    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<List<Booking>> getBookingsByFacility(@NonNull @PathVariable String facilityId) {
        List<Booking> bookings = bookingService.getBookingsByFacility(facilityId);
        return ResponseEntity.ok(bookings);
    }

    // Get bookings by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@NonNull @PathVariable String status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    // Get upcoming bookings for user
    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<Booking>> getUpcomingBookingsForUser(@NonNull @PathVariable String userId) {
        List<Booking> bookings = bookingService.getUpcomingBookingsForUser(userId);
        return ResponseEntity.ok(bookings);
    }

    // Get past bookings for user
    @GetMapping("/user/{userId}/past")
    public ResponseEntity<List<Booking>> getPastBookingsForUser(@NonNull @PathVariable String userId) {
        List<Booking> bookings = bookingService.getPastBookingsForUser(userId);
        return ResponseEntity.ok(bookings);
    }

    // Get bookings for specific date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Booking>> getBookingsByDate(@NonNull @PathVariable String date) {
        // Parse date string and convert to LocalDateTime
        LocalDateTime startOfDay = LocalDateTime.parse(date + "T00:00:00");
        LocalDateTime endOfDay = LocalDateTime.parse(date + "T23:59:59");
        
        List<Booking> bookings = bookingService.getBookingsByDate(startOfDay, endOfDay);
        return ResponseEntity.ok(bookings);
    }

    // Check availability for facility
    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> checkAvailability(@RequestParam Map<String, String> params) {
        String facilityId = params.get("facilityId");
        String startTime = params.get("startTime");
        String endTime = params.get("endTime");
        
        if (facilityId == null || startTime == null || endTime == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Map<String, Object> availability = bookingService.checkAvailability(
                facilityId, 
                LocalDateTime.parse(startTime), 
                LocalDateTime.parse(endTime)
        );
        
        return ResponseEntity.ok(availability);
    }

    // Get booking statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getBookingStatistics() {
        Map<String, Object> statistics = bookingService.getBookingStatistics();
        return ResponseEntity.ok(statistics);
    }
}
