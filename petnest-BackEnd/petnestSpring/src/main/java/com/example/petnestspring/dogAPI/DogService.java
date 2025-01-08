package com.example.petnestspring.dogAPI;



import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DogService {

    private final String BASE_URL = "https://dog.ceo/api";
    private final RestTemplate restTemplate;

    public DogService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Fetch all breeds
    public Object getBreeds() {
        String url = BASE_URL + "/breeds/list/all";
        return restTemplate.exchange(url, HttpMethod.GET, null, Object.class).getBody();
    }

    // Fetch dog images by breed
    public Object getDogByBreed(String breed) {
        String url = BASE_URL + "/breed/" + breed + "/images";
        return restTemplate.exchange(url, HttpMethod.GET, null, Object.class).getBody();
    }

    // Fetch a random dog image
    public Object getRandomDogImage() {
        String url = BASE_URL + "/breeds/image/random";
        return restTemplate.exchange(url, HttpMethod.GET, null, Object.class).getBody();
    }
}
