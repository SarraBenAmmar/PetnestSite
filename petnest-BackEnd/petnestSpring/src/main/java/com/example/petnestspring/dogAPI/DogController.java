package com.example.petnestspring.dogAPI;



import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dogs")
public class DogController {

    private final DogService dogService;

    public DogController(DogService dogService) {
        this.dogService = dogService;
    }

    // Endpoint to get all dog breeds
    @GetMapping("/breeds")
    public Object getAllBreeds() {
        return dogService.getBreeds();
    }

    // Endpoint to get a random dog image by breed
    @GetMapping("/breed/{breed}/image")
    public Object getDogImageByBreed(@PathVariable String breed) {
        return dogService.getDogByBreed(breed);
    }

    // Endpoint to get a random dog image
    @GetMapping("/random")
    public Object getRandomDogImage() {
        return dogService.getRandomDogImage();
    }
}

