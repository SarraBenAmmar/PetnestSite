package com.example.petnestspring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow all endpoints to accept CORS requests
                .allowedOrigins("http://localhost:3000") // React app's URL
                .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS") // HTTP methods to allow
                .allowedHeaders("*") // Allow all headers
                .exposedHeaders("Authorization", "Link") // Expose important headers (optional)
                .allowCredentials(true) // Allow credentials (cookies, Authorization header, etc.)
                .maxAge(3600); // Cache preflight response for 1 hour
    }
}
