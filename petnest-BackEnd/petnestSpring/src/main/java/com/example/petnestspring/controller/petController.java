package com.example.petnestspring.controller;

import com.example.petnestspring.Entities.Pet;
import com.example.petnestspring.Entities.enm.Gender;
import com.example.petnestspring.dto.PetDto;
import com.example.petnestspring.service.PetService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class petController {

    private final PetService petService;

    @GetMapping("/getAllPets")
    public ResponseEntity<List<Pet>> getAllPets() {
        return ResponseEntity.ok(petService.getAllPets());
    }


    @PostMapping("/addPet")
    public ResponseEntity<?> addPet(@RequestBody PetDto petDto) {
        try {
            // Validate mandatory fields
            if (petDto.getImage() == null || petDto.getImage().isEmpty()) {
                return ResponseEntity.badRequest().body("Image data is missing");
            }

            byte[] decodedImage;
            try {
                decodedImage = Base64.getDecoder().decode(petDto.getImage());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid Base64 image data");
            }

            // Resize the image
            String resizedImage = resizeImage(decodedImage, 500); // Resize to a max width/height of 500px

            // Map the resized image to the Pet entity
            Pet pet = Pet.builder()
                    .name(petDto.getName())
                    .petCategory(petDto.getPetCategory())
                    .description(petDto.getDescription())
                    .age(petDto.getAge())
                    .breed(petDto.getBreed())
                    .height(petDto.getHeight())
                    .weight(petDto.getWeight())
                    .gender(petDto.getGender())
                    .GoodWith(petDto.getGoodWith())
                    .image(resizedImage) // Store the resized Base64 string
                    .location(petDto.getLocation())
                    .health(petDto.getHealth())
                    .aggressionLevel(petDto.getAggressionLevel())
                    .color(petDto.getColor())
                    .build();
            // Save the pet entity
            petService.createPet(pet);
            // Return the saved pet DTO
            return ResponseEntity.ok(petDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing the request: " + e.getMessage());
        }
    }

    // Helper method to resize the image
    private String resizeImage(byte[] originalImageBytes, int maxSize) throws IOException {
        // Convert byte array to BufferedImage
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(originalImageBytes);
        BufferedImage originalImage = ImageIO.read(byteArrayInputStream);
        // Calculate the scaling factor
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        double scale = Math.min((double) maxSize / width, (double) maxSize / height);
        // Calculate the new dimensions
        int newWidth = (int) (width * scale);
        int newHeight = (int) (height * scale);
        // Resize the image
        Image scaledImage = originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
        // Convert the scaled image back to a BufferedImage
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resizedImage.createGraphics();
        graphics.drawImage(scaledImage, 0, 0, null);
        graphics.dispose();
        // Convert the resized image back to a byte array
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "jpg", byteArrayOutputStream);
        byte[] resizedImageBytes = byteArrayOutputStream.toByteArray();
        // Return the resized image as a Base64 string
        return Base64.getEncoder().encodeToString(resizedImageBytes);
    }
    @PutMapping("/editPet/{id}")
    public ResponseEntity<?> editPet(@PathVariable Long id, @RequestBody PetDto petDto) {
        try {
            // Fetch the existing pet to update
            Pet existingPet = petService.getpetById(id);

            // Validate mandatory fields
            if (petDto.getImage() != null && !petDto.getImage().isEmpty()) {
                byte[] decodedImage;
                try {
                    decodedImage = Base64.getDecoder().decode(petDto.getImage());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Invalid Base64 image data");
                }

                // Resize the image
                String resizedImage = resizeImage(decodedImage, 500); // Resize to a max width/height of 500px
                existingPet.setImage(resizedImage);
            }

            // Update other fields
            existingPet.setName(petDto.getName());
            existingPet.setPetCategory(petDto.getPetCategory());
            existingPet.setDescription(petDto.getDescription());
            existingPet.setAge(petDto.getAge());
            existingPet.setBreed(petDto.getBreed());
            existingPet.setHeight(petDto.getHeight());
            existingPet.setWeight(petDto.getWeight());
            existingPet.setGender(petDto.getGender());
            existingPet.setGoodWith(petDto.getGoodWith());
            existingPet.setLocation(petDto.getLocation());
            existingPet.setHealth(petDto.getHealth());
            existingPet.setAggressionLevel(petDto.getAggressionLevel());
            existingPet.setColor(petDto.getColor());

            // Save the updated pet
            petService.updatePet(existingPet);

            return ResponseEntity.ok("Pet updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the pet: " + e.getMessage());
        }
    }




    @GetMapping("/getPetsByCategory")
    public ResponseEntity<List<Pet>> getAllPetsByCategory(@NonNull @RequestParam String category) {
        return ResponseEntity.ok(petService.getAllPetsByCategory(category));
    }

    @GetMapping("/getPetsByOwner")
    public ResponseEntity<List<Pet>> getAllPetsByOwner() {
        return ResponseEntity.ok(petService.getAllPetsByOwner());
    }

    @GetMapping("/deletePet/{id}")
    public ResponseEntity<String> deletePet(@NonNull @PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok("Pet deleted successfully");
    }

    @GetMapping("/getpetById/{id}")
    public ResponseEntity<PetDto> getpetByIdWithOwnerId(@NonNull @PathVariable Long id) {
        Pet pet = petService.getpetById(id);

        // Map the Pet entity to PetDto
        PetDto petDto = new PetDto();
        petDto.setName(pet.getName());
        petDto.setPetCategory(pet.getPetCategory());
        petDto.setDescription(pet.getDescription());
        petDto.setAge(pet.getAge());
        petDto.setBreed(pet.getBreed());
        petDto.setHeight(pet.getHeight());
        petDto.setWeight(pet.getWeight());
        petDto.setGender(pet.getGender());
        petDto.setGoodWith(pet.getGoodWith());
        petDto.setImage(pet.getImage());
        petDto.setLocation(pet.getLocation());
        petDto.setHealth(pet.getHealth());
        petDto.setAggressionLevel(pet.getAggressionLevel());
        petDto.setColor(pet.getColor());
        petDto.setOwnerPhoneNumber(pet.getOwnerPhoneNumber());

        // Set the ownerId instead of the full owner object
        if (pet.getOwner() != null) {
            petDto.setOwnerId(pet.getOwner().getId());
        } else {
            petDto.setOwnerId(null); // In case owner is null
        }

        return ResponseEntity.ok(petDto);
    }
    @GetMapping("/getPetsByLocation")
    public ResponseEntity<?> getAllPetsByLocation(@RequestParam String location) {
        List<Pet> pets = petService.getAllPetsByLocation(location);
        if (pets.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "No pets found for the given location"));
        }
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/getPetsByBreed")
    public ResponseEntity<?> getAllPetsByBreed(@RequestParam String breed) {
        List<Pet> pets = petService.getAllPetsByBreed(breed);
        if (pets.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "No pets found for the given breed"));
        }
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/getPetsByGender")
    public ResponseEntity<?> getAllPetsByGender(@RequestParam Gender gender) {
        List<Pet> pets = petService.getAllPetsByGender(gender);
        if (pets.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "No pets found for the given gender"));
        }
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/getPetsByColor")
    public ResponseEntity<?> getAllPetsByColor(@RequestParam String color) {
        List<Pet> pets = petService.getAllPetsByColor(color);
        if (pets.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "No pets found for the given color"));
        }
        return ResponseEntity.ok(pets);
    }

}