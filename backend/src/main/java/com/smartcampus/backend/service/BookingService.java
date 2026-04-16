package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.BookingRequestDTO;
import com.smartcampus.backend.dto.BookingResponseDTO;
import com.smartcampus.backend.model.BookingStatus;

import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO request);

    BookingResponseDTO getBookingById(String id);

    List<BookingResponseDTO> getAllBookings();

    List<BookingResponseDTO> getBookingsByUserId(String userId);

    List<BookingResponseDTO> getBookingsByStatus(BookingStatus status);

    BookingResponseDTO updateBooking(String id, BookingRequestDTO request);

    BookingResponseDTO updateBookingStatus(String id, BookingStatus status);

    void deleteBooking(String id);
}
