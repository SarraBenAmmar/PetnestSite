package com.example.petnestspring.OpenStreetMapAPI;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class OSMController {

    private final OSMService googleMapService;

    @Autowired
    public OSMController(OSMService googleMapService) {
        this.googleMapService = googleMapService;
    }

    @GetMapping("/showMap")
    public ResponseEntity<?> showMap(@RequestParam("location") String location) {
        try {
            // Call the OpenStreetMap Nominatim API to fetch coordinates based on the location name
            String geocodeResponse = googleMapService.getGeocode(location);

            // Log the raw response from OSM Nominatim API
            System.out.println("Geocode Response: " + geocodeResponse);

            // Parse the response from OpenStreetMap Nominatim API
            JsonNode rootNode = googleMapService.parseGeocodeResponse(geocodeResponse);

            if (rootNode != null && rootNode.isArray() && rootNode.size() > 0) {
                // Extract latitude and longitude from the first result
                double lat = rootNode.get(0).get("lat").asDouble();
                double lng = rootNode.get(0).get("lon").asDouble();

                // Return the coordinates as a JSON response
                return ResponseEntity.ok(new LocationResponse(lat, lng));
            } else {
                return ResponseEntity.status(404).body("Location not found.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error occurred: " + e.getMessage());
        }
    }

    // DTO for structured response
    public static class LocationResponse {
        private double lat;
        private double lng;

        public LocationResponse(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public double getLat() {
            return lat;
        }

        public void setLat(double lat) {
            this.lat = lat;
        }

        public double getLng() {
            return lng;
        }

        public void setLng(double lng) {
            this.lng = lng;
        }
    }
}
