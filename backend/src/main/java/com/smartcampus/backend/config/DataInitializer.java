package com.smartcampus.backend.config;

import com.smartcampus.backend.entity.Facility;
import com.smartcampus.backend.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final FacilityRepository facilityRepository;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            // Wait a bit for MongoDB connection to be established
            Thread.sleep(5000);
            
            // Test connection with a simple operation
            facilityRepository.count();
            
            if (facilityRepository.count() == 0) {
                log.info("Initializing sample facilities data...");
                initializeFacilities();
                log.info("Sample facilities data initialized successfully!");
            } else {
                log.info("Facilities data already exists, skipping initialization.");
            }
        } catch (Exception e) {
            log.error("MongoDB connection failed. Application will start without database initialization: {}", e.getMessage());
            log.info("Please check your MongoDB connection and restart the application to initialize data.");
            // Don't fail the application startup, just log the error
        }
    }
    
    private void initializeFacilities() {
        // Lecture Halls
        facilityRepository.save(createFacility(
                "Main Lecture Hall A",
                Facility.FacilityType.LECTURE_HALL,
                200,
                "Building A, Floor 1",
                "Large lecture hall with modern presentation equipment",
                Facility.FacilityStatus.ACTIVE,
                LocalTime.of(8, 0),
                LocalTime.of(22, 0),
                true
        ));
        
        facilityRepository.save(createFacility(
                "Lecture Hall B",
                Facility.FacilityType.LECTURE_HALL,
                150,
                "Building A, Floor 2",
                "Medium-sized lecture hall with video conferencing",
                Facility.FacilityStatus.ACTIVE,
                LocalTime.of(8, 0),
                LocalTime.of(22, 0),
                true
        ));
        
        // Laboratories
        facilityRepository.save(createFacility(
                "Computer Lab 1",
                Facility.FacilityType.LABORATORY,
                40,
                "Building B, Floor 1",
                "Computer lab with 40 workstations",
                Facility.FacilityStatus.ACTIVE,
                LocalTime.of(9, 0),
                LocalTime.of(21, 0),
                false
        ));
        
        facilityRepository.save(createFacility(
                "Physics Lab",
                Facility.FacilityType.LABORATORY,
                30,
                "Building B, Floor 2",
                "Physics laboratory with experimental equipment",
                Facility.FacilityStatus.MAINTENANCE,
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                false
        ));
        
        // Meeting Rooms
        facilityRepository.save(createFacility(
                "Conference Room 1",
                Facility.FacilityType.MEETING_ROOM,
                20,
                "Building C, Floor 1",
                "Conference room with projector and whiteboard",
                Facility.FacilityStatus.ACTIVE,
                LocalTime.of(8, 0),
                LocalTime.of(20, 0),
                true
        ));
        
        facilityRepository.save(createFacility(
                "Meeting Room 2",
                Facility.FacilityType.MEETING_ROOM,
                10,
                "Building C, Floor 2",
                "Small meeting room for team discussions",
                Facility.FacilityStatus.ACTIVE,
                LocalTime.of(8, 0),
                LocalTime.of(20, 0),
                true
        ));
        
        // Auditorium
        facilityRepository.save(createFacility(
                "Main Auditorium",
                Facility.FacilityType.AUDITORIUM,
                500,
                "Building D, Ground Floor",
                "Large auditorium for events and presentations",
                Facility.FacilityStatus.ACTIVE,
                LocalTime.of(8, 0),
                LocalTime.of(23, 0),
                true
        ));
        
        // Sports Facilities
        facilityRepository.save(createFacility(
                "Basketball Court",
                Facility.FacilityType.SPORTS_FACILITY,
                20,
                "Sports Complex",
                "Indoor basketball court",
                Facility.FacilityStatus.ACTIVE,
                LocalTime.of(6, 0),
                LocalTime.of(22, 0),
                true
        ));
        
        // Study Areas
        facilityRepository.save(createFacility(
                "Library Study Area 1",
                Facility.FacilityType.STUDY_AREA,
                50,
                "Library, Floor 2",
                "Quiet study area with individual desks",
                Facility.FacilityStatus.ACTIVE,
                LocalTime.of(7, 0),
                LocalTime.of(23, 0),
                true
        ));
        
        // Equipment
        facilityRepository.save(createFacility(
                "Portable Projector 1",
                Facility.FacilityType.EQUIPMENT,
                1,
                "IT Department",
                "High-quality portable projector",
                Facility.FacilityStatus.ACTIVE,
                LocalTime.of(8, 0),
                LocalTime.of(20, 0),
                false
        ));
        
        facilityRepository.save(createFacility(
                "Video Camera Kit",
                Facility.FacilityType.EQUIPMENT,
                1,
                "Media Department",
                "Professional video recording equipment",
                Facility.FacilityStatus.OUT_OF_SERVICE,
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                false
        ));
    }
    
    private Facility createFacility(String name, Facility.FacilityType type, Integer capacity,
                                   String location, String description, Facility.FacilityStatus status,
                                   LocalTime startTime, LocalTime endTime, boolean availableWeekends) {
        Facility facility = new Facility();
        facility.setName(name);
        facility.setType(type);
        facility.setCapacity(capacity);
        facility.setLocation(location);
        facility.setDescription(description);
        facility.setStatus(status);
        facility.setAvailableStartTime(startTime);
        facility.setAvailableEndTime(endTime);
        facility.setAvailableWeekends(availableWeekends);
        facility.setImageUrl("https://via.placeholder.com/300x200?text=" + name.replace(" ", "+"));
        return facility;
    }
}
