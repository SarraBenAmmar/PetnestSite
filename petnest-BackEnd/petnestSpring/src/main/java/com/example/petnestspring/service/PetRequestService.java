package com.example.petnestspring.service;

import com.example.petnestspring.Entities.PetRequest;
import com.example.petnestspring.Entities.enm.RequestStatus;
import com.example.petnestspring.dto.PetRequestDTO;


import java.util.List;

public interface PetRequestService {

    PetRequest requestPet( PetRequestDTO requestPetDTO);

    PetRequest updateRequestStatus(Long requestId, RequestStatus status);

    List<PetRequest> getRequestsByUser(Long userId);

    List<PetRequest> getRequestsByPetOwner(Long ownerId);
    void deleteRequest(Long requestId);
}
