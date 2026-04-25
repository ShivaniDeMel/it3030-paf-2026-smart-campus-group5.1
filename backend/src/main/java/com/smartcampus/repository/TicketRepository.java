package com.smartcampus.repository;

import com.smartcampus.model.MaintenanceTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<MaintenanceTicket, String> {
    List<MaintenanceTicket> findByAssignedTechnicianId(String assignedTechnicianId);
    List<MaintenanceTicket> findByReportedById(String reportedById);
}
