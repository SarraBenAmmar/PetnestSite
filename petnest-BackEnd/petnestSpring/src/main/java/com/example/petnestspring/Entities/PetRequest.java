package com.example.petnestspring.Entities;

import com.example.petnestspring.Entities.enm.RequestStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PetRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who sends the request
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    // The user who receives the request (pet owner)
    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    // The requested pet
    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    // Request status (PENDING, ACCEPTED, REJECTED)
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    // Optional message from the sender to the recipient
    private String message;

    // Timestamp of when the request was created
    private LocalDateTime createdAt = LocalDateTime.now();
}
