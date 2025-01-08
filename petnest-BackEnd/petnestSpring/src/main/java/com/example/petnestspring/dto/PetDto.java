package com.example.petnestspring.dto;

import com.example.petnestspring.Entities.enm.Gender;
import com.example.petnestspring.Entities.enm.PetCategory;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Lob;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Builder
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PetDto {
    private String name;

    @Enumerated(EnumType.STRING)
    private PetCategory petCategory;

    private String description;
    private float age;
    private String breed;
    private float height;
    private float weight;
    private Gender gender;
    private String goodWith;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;
    private String location;
    private String health;
    private String aggressionLevel;
    private String color;
    private String ownerPhoneNumber;

    // Add the ownerId field
    private Long ownerId; // This will only store the owner ID
}
