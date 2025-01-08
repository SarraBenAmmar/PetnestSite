package com.example.petnestspring.repository;

import com.example.petnestspring.Entities.PetRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetRequestRepository extends JpaRepository<PetRequest, Long> {

    // Find all requests by sender's ID (sender is the user who made the request)
    List<PetRequest> findAllBySenderId(Long senderId);

    // Find all requests by recipient's ID (recipient is the pet owner)
    List<PetRequest> findAllByRecipientId(Long recipientId);

    // Optionally, find requests by status (e.g., PENDING, ACCEPTED, REJECTED)
    List<PetRequest> findAllByStatus(String status);
}
