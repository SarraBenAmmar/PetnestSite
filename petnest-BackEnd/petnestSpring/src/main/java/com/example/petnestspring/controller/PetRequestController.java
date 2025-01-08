package com.example.petnestspring.controller;

import com.example.petnestspring.Entities.PetRequest;
import com.example.petnestspring.Entities.User;
import com.example.petnestspring.Entities.enm.RequestStatus;
import com.example.petnestspring.dto.PetRequestDTO;
import com.example.petnestspring.service.PetRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/pet-requests")
@RequiredArgsConstructor
public class PetRequestController {

    private final PetRequestService petRequestService;

    @PostMapping("/request")
    public ResponseEntity<?> requestPet(@RequestBody  PetRequestDTO requestPetDTO) {
        PetRequest petRequest = petRequestService.requestPet(requestPetDTO);
        PetRequestDTO petRequestDTO = mapToDTO(petRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                "{\"message\": \"Pet requested successfully\", \"data\": " + petRequestDTO + "}"
        );
    }

    @PatchMapping("/update-status/{requestId}")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long requestId, @RequestParam RequestStatus status) {
        PetRequest updatedPetRequest = petRequestService.updateRequestStatus(requestId, status);
        PetRequestDTO petRequestDTO = mapToDTO(updatedPetRequest);
        return ResponseEntity.ok(
                "{\"message\": \"Request status updated successfully\", \"data\": " + petRequestDTO + "}"
        );
    }

    @GetMapping("/my-requests")
    public ResponseEntity<?> getRequestsByUser() {
        Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        List<PetRequest> petRequests = petRequestService.getRequestsByUser(userId);
        List<PetRequestDTO> petRequestDTOs = petRequests.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        // Return only the data (petRequestDTOs) without the message
        return ResponseEntity.ok(petRequestDTOs);
    }


    @GetMapping("/owner-requests")
    public ResponseEntity<?> getRequestsByPetOwner() {
        Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        List<PetRequest> petRequests = petRequestService.getRequestsByPetOwner(userId);
        List<PetRequestDTO> petRequestDTOs = petRequests.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(
                "{\"message\": \"Fetched pet owner requests successfully\", \"data\": " + petRequestDTOs + "}"
        );
    }

    private PetRequestDTO mapToDTO(PetRequest petRequest) {
        return PetRequestDTO.builder()
                .id(petRequest.getId())
                .message(petRequest.getMessage())
                .status(petRequest.getStatus())
                .petId(petRequest.getPet().getId())
                .senderId(petRequest.getSender().getId())
                .recipientId(petRequest.getRecipient().getId())
                .createdAt(petRequest.getCreatedAt())
                .build();
    }
    @DeleteMapping("/delete/{requestId}")
    public ResponseEntity<?> deletePetRequest(@PathVariable Long requestId) {
        try {
            petRequestService.deleteRequest(requestId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("{\"message\": \"Pet request deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"Pet request not found\"}");
        }
    }
}