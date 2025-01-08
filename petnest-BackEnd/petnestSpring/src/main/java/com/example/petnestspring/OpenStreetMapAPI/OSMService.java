package com.example.petnestspring.OpenStreetMapAPI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class
OSMService {

    private final RestTemplate restTemplate;

    public OSMService(RestTemplate restTemplate) {

        this.restTemplate = restTemplate;
    }

    public String getGeocode(String location) {
        // Build the URL for OpenStreetMap Nominatim API request
        String url = String.format("https://nominatim.openstreetmap.org/search?q=%s&format=json&addressdetails=1&limit=1", location);

        // Fetch the response from OpenStreetMap Nominatim API
        return restTemplate.getForObject(url, String.class);
    }

    public JsonNode parseGeocodeResponse(String response) {
        try {
            // Parse the response into a JsonNode
            return new ObjectMapper().readTree(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse geocode response", e);
        }
    }
}
