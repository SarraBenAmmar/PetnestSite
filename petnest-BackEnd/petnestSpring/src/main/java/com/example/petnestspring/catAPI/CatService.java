package com.example.petnestspring.catAPI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CatService {

    @Value("${cat.api.key}") // API key from application.properties
    private String apiKey;

    private final String BASE_URL = "https://api.thecatapi.com/v1";
    private final RestTemplate restTemplate;

    public CatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Fetch all breeds
    public Object getBreeds() {
        String url = BASE_URL + "/breeds";
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(url, HttpMethod.GET, entity, Object.class).getBody();
    }

    // Fetch cat images by breed
    public Object getCatByBreed(String breedId) {
        String url = BASE_URL + "/images/search?breed_ids=" + breedId;
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(url, HttpMethod.GET, entity, Object.class).getBody();
    }

    // Fetch a random cat image
    public Object getRandomCatImage() {
        String url = BASE_URL + "/images/search";
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(url, HttpMethod.GET, entity, Object.class).getBody();
    }
}
