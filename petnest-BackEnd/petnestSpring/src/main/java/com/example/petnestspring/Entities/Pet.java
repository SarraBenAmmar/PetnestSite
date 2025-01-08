package com.example.petnestspring.Entities;

import com.example.petnestspring.Entities.enm.Gender;
import com.example.petnestspring.Entities.enm.PetCategory;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    private PetCategory petCategory;
    private String description;
    private float age;
    private String breed;
    private float height;
    private float weight;
    private Gender gender;
    private String GoodWith;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;
    private String location;
    private String health;
    private String aggressionLevel;
    private String color;
    private String ownerPhoneNumber;
    private boolean desactivated = false;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User Owner;


}
