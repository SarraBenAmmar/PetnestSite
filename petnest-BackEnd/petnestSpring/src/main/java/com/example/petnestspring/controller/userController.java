package com.example.petnestspring.controller;

import com.example.petnestspring.Auth.AuthenticationService;
import com.example.petnestspring.Entities.User;
import com.example.petnestspring.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class userController {
    private final AuthenticationService authenticationService;

    @GetMapping("getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authenticationService.getAllUsers());
    }

    @PostMapping("promoteUser/{email}")
    public ResponseEntity<User> promoteUser(
            @PathVariable String email
    ) {
        return ResponseEntity.ok(authenticationService.promoteUser(email));
    }

    @GetMapping("getUserById/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id
    ) {
        User user = authenticationService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
    @PostMapping("/addUser")
    public ResponseEntity<Map<String, String>> addUser(@RequestBody UserDTO userDTO) {
        Map<String, String> response = new HashMap<>();
        try {
            authenticationService.addUser(userDTO);
            response.put("message", "User added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }



    @PutMapping("editUser/{id}")
    public ResponseEntity<Map<String, String>> editUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            authenticationService.editUser(id, userDTO);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User edited successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to edit user");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("deleteUser/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        authenticationService.deactivateUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deactivated successfully");
        response.put("userId", String.valueOf(id));
        return ResponseEntity.ok(response);
    }

}
