package com.example.petnestspring.service.implementation;

import com.example.petnestspring.Entities.Pet;
import com.example.petnestspring.Entities.PetRequest;
import com.example.petnestspring.Entities.User;
import com.example.petnestspring.Entities.enm.RequestStatus;
import com.example.petnestspring.dto.PetRequestDTO;
import com.example.petnestspring.repository.PetRequestRepository;
import com.example.petnestspring.repository.PetRepository;
import com.example.petnestspring.service.PetRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PetRequestServiceImpl implements PetRequestService {

    private final PetRequestRepository petRequestRepository;
    private final PetRepository petRepository;

    @Override
    public PetRequest requestPet( PetRequestDTO requestPetDTO) {
        User requester = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Pet pet = petRepository.findById(requestPetDTO.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        User recipient = pet.getOwner(); // Fetch pet owner (recipient)

        PetRequest petRequest = PetRequest.builder()
                .sender(requester)
                .recipient(recipient)
                .pet(pet)
                .message(requestPetDTO.getMessage())
                .status(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return petRequestRepository.save(petRequest);
    }



    @Override
    public PetRequest updateRequestStatus(Long requestId, RequestStatus status) {
        PetRequest petRequest = petRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        petRequest.setStatus(status);
        return petRequestRepository.save(petRequest);
    }

    @Override
    public List<PetRequest> getRequestsByUser(Long userId) {
        // Fetch pet requests where the user is the recipient
        List<PetRequest> petRequests = petRequestRepository.findAllByRecipientId(userId);
        return petRequests;
    }

    @Override
    public List<PetRequest> getRequestsByPetOwner(Long ownerId) {
        return petRequestRepository.findAllByRecipientId(ownerId);
    }
    @Override
    public void deleteRequest(Long requestId) {
        PetRequest petRequest = petRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        petRequestRepository.delete(petRequest);
    }
}