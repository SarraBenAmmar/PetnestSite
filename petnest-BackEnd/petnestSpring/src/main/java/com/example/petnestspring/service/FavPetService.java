package com.example.petnestspring.service;

import com.example.petnestspring.Entities.favPet;

public interface FavPetService {
    favPet CreateFavPet();
    favPet getFavPets();

    favPet getFavPet();


     favPet addPetToFav(Long petId);

    favPet removePetFromFav(Long petId);
}
