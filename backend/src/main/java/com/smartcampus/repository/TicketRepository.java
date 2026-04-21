package com.smartcampus.repository;

import com.smartcampus.model.MaintenanceTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends MongoRepository<MaintenanceTicket, String> {
}
