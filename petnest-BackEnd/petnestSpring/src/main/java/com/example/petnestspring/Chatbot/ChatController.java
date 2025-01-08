package com.example.petnestspring.Chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate;

    public ChatController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askChatbot(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.get("message");

            // Build request payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "gpt-3.5-turbo");
            payload.put("messages", new Object[] {
                    Map.of("role", "system", "content", "You are an expert in pet adoption."),
                    Map.of("role", "user", "content", userMessage)
            });

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(payload, headers);
            // Make API request
            ResponseEntity<String> response = restTemplate.exchange(
                    OPENAI_API_URL,
                    HttpMethod.POST,
                    httpEntity,
                    String.class
            );

            // Return chatbot's response
            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error communicating with the chatbot: " + e.getMessage());
        }
    }
}
