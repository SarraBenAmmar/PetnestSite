package com.example.petnestspring.service.implementation;

import com.example.petnestspring.Entities.Pet;
import com.example.petnestspring.Entities.User;
import com.example.petnestspring.Entities.enm.Gender;
import com.example.petnestspring.Entities.enm.PetCategory;
import com.example.petnestspring.repository.PetRepository;
import com.example.petnestspring.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;

    @Override
    public Pet createPet(Pet pet) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        pet.setOwner(user);
        if (pet.getOwnerPhoneNumber() == null){
            pet.setOwnerPhoneNumber(user.getPhoneNumber());
        }
        return petRepository.save(pet);
    }

    @Override
    public Pet updatePet(Pet pet) {
        Pet pet1 = petRepository.findById(pet.getId()).orElseThrow(() -> new RuntimeException("Pet not found"));
        pet1.setName(pet.getName());
        pet1.setAge(pet.getAge());
        pet1.setBreed(pet.getBreed());
        pet1.setGender(pet.getGender());
        pet1.setWeight(pet.getWeight());
        pet1.setAggressionLevel(pet.getAggressionLevel());
        pet1.setColor(pet.getColor());
        pet1.setDescription(pet.getDescription());
        pet1.setImage(pet.getImage());
        return petRepository.save(pet1);
    }

    @Override
    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }


    @Override
    public List<Pet> getAllPets() {
        List<Pet> pets = petRepository.findAll();
        if (pets.isEmpty()) {
            throw new RuntimeException("No pets found");
        }
        return pets;
    }

    @Override
    public List<Pet> getAllPetsByCategory(String category) {
        PetCategory petCategory = PetCategory.valueOf(category);
        List<Pet> pets = petRepository.findAllByPetCategory(petCategory);
        if (pets.isEmpty()) {
            throw new RuntimeException("No pets found");
        }
        return pets;
    }

    @Override
    public List<Pet> getAllPetsByOwner() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = user.getId();
        System.out.println("Fetching pets for user ID: " + userId); // Log de l'ID de l'utilisateur

        List<Pet> pets = petRepository.findAllByNativeQuery(userId);

        if (pets.isEmpty()) {
            System.out.println("No pets found for user ID: " + userId);
            return pets; // Returns an empty list if no pets are found
        }

        return pets;
    }



    public Pet getpetById(Long petId) {
        return petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
    }
    public void desactivatePetsByOwnerId(Long ownerId) {
        petRepository.updateDesactivatedByOwnerId(ownerId, true);
    }
    @Override
    public List<Pet> getAllPetsByLocation(String location) {
        List<Pet> pets = petRepository.findAllByLocation(location);
        if (pets.isEmpty()) {
            throw new RuntimeException("No pets found at this location");
        }
        return pets;
    }

    @Override
    public List<Pet> getAllPetsByBreed(String breed) {
        List<Pet> pets = petRepository.findAllByBreed(breed);
        if (pets.isEmpty()) {
            throw new RuntimeException("No pets found with this breed");
        }
        return pets;
    }

    @Override
    public List<Pet> getAllPetsByGender(Gender gender) {
        List<Pet> pets = petRepository.findAllByGender(gender);
        if (pets.isEmpty()) {
            throw new RuntimeException("No pets found with this gender");
        }
        return pets;
    }

    @Override
    public List<Pet> getAllPetsByColor(String color) {
        List<Pet> pets = petRepository.findAllByColor(color);
        if (pets.isEmpty()) {
            throw new RuntimeException("No pets found with this color");
        }
        return pets;
    }
}
