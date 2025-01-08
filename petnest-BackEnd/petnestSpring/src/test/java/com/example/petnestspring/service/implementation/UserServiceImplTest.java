package com.example.petnestspring.service.implementation;

import com.example.petnestspring.config.JwtService;
import com.example.petnestspring.Entities.User;
import com.example.petnestspring.repository.UserRepository;
import com.example.petnestspring.Auth.AuthenticationService;  // import AuthenticationService
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class UserServiceImplTest {
    private UserRepository userRepository = Mockito.mock(UserRepository.class);
    private PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
    private JwtService jwtService = Mockito.mock(JwtService.class);
    private AuthenticationManager authenticationManager = Mockito.mock(AuthenticationManager.class);
    private AuthenticationService authenticationService = Mockito.mock(AuthenticationService.class);  // Mock AuthenticationService
    private UserServiceImpl userService;

    @BeforeEach
    public void setUp() {
        userService = new UserServiceImpl(userRepository);  // Pass both dependencies
    }

    @Test
    public void testGetUserByUsername() {
        User user = User.builder()
                .firstName("test")
                .lastName("test")
                .email("test")
                .phoneNumber("test")
                .address("test")
                .city("test")
                .country("test")
                .password("test")
                .build();
        when(userRepository.findByEmail("test")).thenReturn(Optional.of(user));
        User user1 = userService.getUserByUsername("test");
        assertEquals(user, user1);
    }

    @Test
    public void testGetUserByUsernameNotFound() {
        when(userRepository.findByEmail("test")).thenReturn(Optional.empty());
        try {
            userService.getUserByUsername("test");
        } catch (RuntimeException e) {
            assertEquals("User not found", e.getMessage());
        }
    }
}
