package com.example.petnestspring.service;

import com.example.petnestspring.Entities.Pet;
import com.example.petnestspring.Entities.enm.Gender;

import java.util.List;

public interface PetService {

    Pet createPet(Pet pet);

    Pet updatePet(Pet pet);

    void deletePet(Long id);

    List<Pet> getAllPets();
    List<Pet> getAllPetsByCategory(String category);
    List<Pet> getAllPetsByOwner();

     Pet getpetById(Long petId);

    void desactivatePetsByOwnerId(Long id);
    List<Pet> getAllPetsByLocation(String location);
    List<Pet> getAllPetsByBreed(String breed);

    List<Pet> getAllPetsByGender(Gender gender);

    List<Pet> getAllPetsByColor(String color);
}
