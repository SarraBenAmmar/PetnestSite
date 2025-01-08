package com.example.petnestspring.catAPI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cats")
public class CatController {

    private final CatService catService;

    public CatController(CatService catService) {
        this.catService = catService;
    }

    // Fetch all breeds
    @GetMapping("/breeds")
    public ResponseEntity<Object> getAllBreeds() {
        try {
            Object breeds = catService.getBreeds();
            return ResponseEntity.ok(breeds);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching breeds: " + e.getMessage());
        }
    }

    // Fetch cats by breed ID
    @GetMapping("/breed/{breedId}")
    public ResponseEntity<Object> getCatByBreed(@PathVariable String breedId) {
        try {
            Object cat = catService.getCatByBreed(breedId);
            return ResponseEntity.ok(cat);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching cat by breed: " + e.getMessage());
        }
    }

    // Fetch a random cat image
    @GetMapping("/random")
    public ResponseEntity<Object> getRandomCatImage() {
        try {
            Object catImage = catService.getRandomCatImage();
            return ResponseEntity.ok(catImage);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching random cat image: " + e.getMessage());
        }
    }
}
