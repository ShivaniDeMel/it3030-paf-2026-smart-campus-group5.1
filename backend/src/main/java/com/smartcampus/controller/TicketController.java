package com.smartcampus.controller;

import com.smartcampus.backend.dto.CreateNotificationRequest;
import com.smartcampus.backend.model.NotificationType;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.model.UserRole;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.NotificationService;
import com.smartcampus.model.*;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.service.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;
import java.util.Comparator;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository backendUserRepository;
    private final NotificationService notificationService;

    public TicketController(
            TicketRepository ticketRepository,
            FileStorageService fileStorageService,
            UserRepository backendUserRepository,
            NotificationService notificationService
    ) {
        this.ticketRepository = ticketRepository;
        this.fileStorageService = fileStorageService;
        this.backendUserRepository = backendUserRepository;
        this.notificationService = notificationService;
    }

    private boolean isAdmin(String role) {
        return role != null && "ADMIN".equalsIgnoreCase(role);
    }

    private boolean isAdminOrTechnician(String role) {
        return role != null && ("ADMIN".equalsIgnoreCase(role) || "TECHNICIAN".equalsIgnoreCase(role));
    }

    private boolean isTechnician(String role) {
        return role != null && "TECHNICIAN".equalsIgnoreCase(role);
    }

    private String resolveTechnicianId(String technicianIdentifier) {
        if (technicianIdentifier == null || technicianIdentifier.isBlank()) {
            return null;
        }

        String trimmed = technicianIdentifier.trim();
        if (!trimmed.toUpperCase().startsWith("TN")) {
            return trimmed;
        }

        try {
            int index = Integer.parseInt(trimmed.substring(2));
            List<User> technicians = backendUserRepository.findByRole(UserRole.TECHNICIAN).stream()
                    .sorted(Comparator.comparing(user ->
                            String.format(
                                    "%s %s %s",
                                    user.getFirstName() == null ? "" : user.getFirstName(),
                                    user.getLastName() == null ? "" : user.getLastName(),
                                    user.getEmail() == null ? "" : user.getEmail()
                            )))
                    .toList();

            if (index < 1 || index > technicians.size()) {
                return null;
            }
            return technicians.get(index - 1).getId();
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    // 1. POST /api/tickets - Create ticket (Multipart to handle 3 images)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createTicket(
            @RequestHeader(value = "X-User-Id", defaultValue = "anon") String userId,
            @RequestHeader(value = "X-User-Name", defaultValue = "Anonymous") String userName,
            @RequestParam("category") Category category,
            @RequestParam("description") String description,
            @RequestParam("priority") Priority priority,
            @RequestParam(value = "contactEmail", required = false) String contactEmail,
            @RequestParam(value = "contactPhone", required = false) String contactPhone,
            @RequestParam(value = "preferredContactMethod", defaultValue = "EMAIL") String preferredContactMethod,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {

        if (files != null && files.length > 3) {
            return ResponseEntity.badRequest().body("Maximum of 3 files allowed.");
        }

        List<AttachmentMetadata> uploadedAttachments = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    AttachmentMetadata meta = fileStorageService.storeFile(file);
                    if (meta != null) {
                        uploadedAttachments.add(meta);
                    }
                }
            }
        }

        MaintenanceTicket ticket = MaintenanceTicket.builder()
                .ticketNumber("TKT-" + System.currentTimeMillis() % 100000)
                .category(category)
                .description(description)
                .priority(priority)
                .status(Status.OPEN)
                .reportedById(userId)
                .reportedByName(userName)
                .contactEmail(contactEmail)
                .contactPhone(contactPhone)
                .preferredContactMethod(preferredContactMethod)
                .attachments(uploadedAttachments)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        ticketRepository.save(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
    }

    // 2. GET /api/tickets/{id} - Retrieve full ticket details + comments
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicket(@PathVariable String id) {
        Optional<MaintenanceTicket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ticketOpt.get());
    }

    // Helper: GET all tickets for a user or all if admin
    @GetMapping
    public ResponseEntity<List<MaintenanceTicket>> getAllTickets(
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestHeader(value = "X-User-Id", defaultValue = "anon") String userId) {
        
        if (isAdmin(role)) {
            return ResponseEntity.ok(ticketRepository.findAll());
        } else if (isTechnician(role)) {
            return ResponseEntity.ok(ticketRepository.findByAssignedTechnicianId(userId));
        } else {
            // USER sees only their own tickets
            return ResponseEntity.ok(ticketRepository.findByReportedById(userId));
        }
    }

    // Technician queue endpoint - assigned tickets only
    @GetMapping("/assigned")
    public ResponseEntity<?> getAssignedTickets(
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestHeader(value = "X-User-Id", defaultValue = "anon") String userId) {
        if (!isTechnician(role) && !isAdmin(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only technicians/admins can view assigned tickets.");
        }
        return ResponseEntity.ok(ticketRepository.findByAssignedTechnicianId(userId));
    }

    // 3. PUT /api/tickets/{id}/status - Update workflow status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestHeader(value = "X-User-Id", defaultValue = "anon") String userId,
            @RequestBody Map<String, String> payload) {
        
        if (!isAdminOrTechnician(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only ADMIN or TECHNICIAN can update status.");
        }

        Optional<MaintenanceTicket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        MaintenanceTicket ticket = ticketOpt.get();
        String statusStr = payload.get("status");

        // Technician scope: only assigned tickets and limited transitions
        if (isTechnician(role)) {
            if (ticket.getAssignedTechnicianId() == null || !userId.equals(ticket.getAssignedTechnicianId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Technicians can only update tickets assigned to them.");
            }
            if (statusStr == null) {
                return ResponseEntity.badRequest().body("Status is required.");
            }
            String normalized = statusStr.toUpperCase();
            if (!"IN_PROGRESS".equals(normalized) && !"RESOLVED".equals(normalized)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Technicians can only set IN_PROGRESS or RESOLVED.");
            }
        }

        if (statusStr != null) {
            try {
                ticket.setStatus(Status.valueOf(statusStr.toUpperCase()));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status.");
            }
        }
        
        if (payload.containsKey("rejectionReason")) {
            ticket.setRejectionReason(payload.get("rejectionReason"));
        }
        if (payload.containsKey("resolutionNotes")) {
            ticket.setResolutionNotes(payload.get("resolutionNotes"));
        }

        // Self-assign only for non-technician staff path
        if (!isTechnician(role) && "IN_PROGRESS".equalsIgnoreCase(statusStr) && ticket.getAssignedTechnicianId() == null) {
            ticket.setAssignedTechnicianId(userId); // Self-assign
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);
        
        return ResponseEntity.ok(ticket);
    }

    // PATCH alias for status updates
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatusPatch(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestHeader(value = "X-User-Id", defaultValue = "anon") String userId,
            @RequestBody Map<String, String> payload) {
        return updateTicketStatus(id, role, userId, payload);
    }

    // Admin assigns technician
    @PatchMapping("/{id}/assign")
    public ResponseEntity<?> assignTechnician(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestBody Map<String, String> payload) {
        if (!isAdmin(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only ADMIN can assign technicians.");
        }

        Optional<MaintenanceTicket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MaintenanceTicket ticket = ticketOpt.get();
        String rawTechnicianId = payload.get("technicianId");
        String resolvedTechnicianId = resolveTechnicianId(rawTechnicianId);
        if (resolvedTechnicianId == null || resolvedTechnicianId.isBlank()) {
            return ResponseEntity.badRequest().body("Invalid technician ID.");
        }

        String technicianName = payload.get("technicianName");
        if (technicianName == null || technicianName.isBlank()) {
            technicianName = backendUserRepository.findById(resolvedTechnicianId)
                    .map(user -> {
                        String fullName = String.format(
                                "%s %s",
                                user.getFirstName() == null ? "" : user.getFirstName(),
                                user.getLastName() == null ? "" : user.getLastName()
                        ).trim();
                        return fullName.isEmpty() ? user.getEmail() : fullName;
                    })
                    .orElse("Technician");
        }

        ticket.setAssignedTechnicianId(resolvedTechnicianId);
        ticket.setAssignedTechnicianName(technicianName);
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        CreateNotificationRequest request = new CreateNotificationRequest();
        request.setUserId(resolvedTechnicianId);
        request.setType(NotificationType.TICKET);
        request.setMessage(String.format(
                "You have been assigned ticket %s (%s priority).",
                ticket.getTicketNumber(),
                ticket.getPriority()
        ));
        notificationService.create(request);

        return ResponseEntity.ok(ticket);
    }

    // Admin rejects ticket with reason
    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectTicket(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestBody Map<String, String> payload) {
        if (!isAdmin(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only ADMIN can reject tickets.");
        }

        Optional<MaintenanceTicket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MaintenanceTicket ticket = ticketOpt.get();
        ticket.setStatus(Status.REJECTED);
        ticket.setRejectionReason(payload.getOrDefault("reason", "Rejected by admin"));
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return ResponseEntity.ok(ticket);
    }

    // Technician/Admin adds resolution notes
    @PatchMapping("/{id}/resolution")
    public ResponseEntity<?> addResolutionNotes(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestHeader(value = "X-User-Id", defaultValue = "anon") String userId,
            @RequestBody Map<String, String> payload) {
        if (!isAdminOrTechnician(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only ADMIN or TECHNICIAN can add resolution notes.");
        }

        Optional<MaintenanceTicket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MaintenanceTicket ticket = ticketOpt.get();
        if (isTechnician(role) && (ticket.getAssignedTechnicianId() == null || !userId.equals(ticket.getAssignedTechnicianId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Technicians can only add notes to assigned tickets.");
        }

        String resolutionNotes = payload.get("resolutionNotes");
        if (resolutionNotes == null || resolutionNotes.isBlank()) {
            return ResponseEntity.badRequest().body("Resolution notes are required.");
        }

        ticket.setResolutionNotes(resolutionNotes.trim());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return ResponseEntity.ok(ticket);
    }

    // Add Comment (Not asked as 1 of the 4, but needed for the nested comment sys)
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", defaultValue = "anon") String userId,
            @RequestHeader(value = "X-User-Name", defaultValue = "Anonymous") String userName,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String userRole,
            @RequestBody Map<String, String> payload) {
        
        Optional<MaintenanceTicket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        MaintenanceTicket ticket = ticketOpt.get();
        Comment comment = Comment.builder()
                .id(UUID.randomUUID().toString())
                .authorId(userId)
                .authorName(userName)
                .role(userRole)
                .text(payload.get("text"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
                
        // ensure initialized
        if(ticket.getComments() == null) { ticket.setComments(new ArrayList<>()); }            
        ticket.getComments().add(comment);
        ticketRepository.save(ticket);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    // 4. DELETE /api/tickets/{id}/comments/{commentId} - Delete a comment
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @RequestHeader(value = "X-User-Id", defaultValue = "anon") String userId,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role) {
        
        Optional<MaintenanceTicket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        MaintenanceTicket ticket = ticketOpt.get();
        if(ticket.getComments() == null) {
            return ResponseEntity.notFound().build();
        }

        Optional<Comment> commentOpt = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId)).findFirst();
                
        if (commentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Comment comment = commentOpt.get();
        // Ownership rules: Must be the author OR an ADMIN
        if (!comment.getAuthorId().equals(userId) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own comments.");
        }
        
        ticket.getComments().remove(comment);
        ticketRepository.save(ticket);
        
        return ResponseEntity.noContent().build();
    }
    
    // 5. PUT /api/tickets/{id}/comments/{commentId} - Edit a comment
    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<?> editComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @RequestHeader(value = "X-User-Id", defaultValue = "anon") String userId,
            @RequestBody Map<String, String> payload) {
        
        Optional<MaintenanceTicket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        MaintenanceTicket ticket = ticketOpt.get();
        if(ticket.getComments() == null) {
            return ResponseEntity.notFound().build();
        }

        Optional<Comment> commentOpt = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId)).findFirst();
                
        if (commentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Comment comment = commentOpt.get();
        // Ownership rules: Must be the author to edit
        if (!comment.getAuthorId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own comments.");
        }
        
        comment.setText(payload.get("text"));
        comment.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);
        
        return ResponseEntity.ok(comment);
    }
    
    // Serve file route
    @GetMapping("/attachments/{filename}")
    public ResponseEntity<Resource> getAttachment(@PathVariable String filename) {
        File file = fileStorageService.getFile(filename);
        if(!file.exists()) {
             return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                // Can ideally detect content-type dynamically but defaults to binary download or image display
                // based on client logic for simplicity
                .body(new FileSystemResource(file));
    }
}
