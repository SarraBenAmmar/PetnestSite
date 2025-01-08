package com.example.petnestspring.dto;

import com.example.petnestspring.Entities.enm.RequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PetRequestDTO {
    private Long id;
    private String message;
    private RequestStatus status;
    private Long petId;
    private Long senderId;
    private Long recipientId;
    private LocalDateTime createdAt;
}
