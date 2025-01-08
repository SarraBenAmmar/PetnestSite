package com.example.petnestspring.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {
    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers(
                        "/api/v1/auth/**",
                        "/api/v1/getAllPets",
                        "/api/v1/getPetsByCategory",
                          "/api/v1/getPetsByLocation",
                        "/api/v1/getPetsByBreed",
                           "/api/v1/getPetsByGender",
                        "/api/v1/getPetsByColor",
                          " /api/v1/auth/confirm",
                        "/api/v1/getpetById/**",
                        "/api/v1/getUserById/*",
                        "/error",
                        "/api/cats/**",
                        "/api/dogs/**",
                        "/showMap",
                         "/api/chat/ask"
                ).permitAll()
                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public HttpFirewall httpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        // Customize allowed behaviors
        firewall.setAllowSemicolon(true);  // Example: Allow semicolons
        firewall.setAllowUrlEncodedSlash(true);  // Example: Allow URL encoded slashes
        firewall.setAllowBackSlash(true);  // Allow backslashes if needed
        firewall.setAllowUrlEncodedPercent(true);  // Allow encoded percent
        return firewall;
    }

}
