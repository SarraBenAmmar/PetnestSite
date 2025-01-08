package com.example.petnestspring.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.Data;

@Data
public class UserDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String city;
    private String country;
    private String password;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image = "https://cdn-icons-png.flaticon.com/256/15133/15133071.png";
    private boolean desactivated = false;// Optional: Include only if required for add/edit
}