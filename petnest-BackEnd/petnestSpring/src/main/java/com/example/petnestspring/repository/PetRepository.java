package com.example.petnestspring.repository;

import com.example.petnestspring.Entities.Pet;
import com.example.petnestspring.Entities.User;
import com.example.petnestspring.Entities.enm.Gender;
import com.example.petnestspring.Entities.enm.PetCategory;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;
@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {


    List<Pet> findAllByPetCategory(PetCategory petCategory);
    @Query(value = "SELECT * FROM pet p WHERE p.owner_id = :id", nativeQuery = true)
    List<Pet> findAllByNativeQuery(Long id);

    @Override
    Optional<Pet> findById(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Pet p SET p.desactivated = ?2 WHERE p.Owner.id = ?1")
    void updateDesactivatedByOwnerId(Long ownerId, boolean desactivated);


    List<Pet> findAllByColor(String color);

    List<Pet> findAllByGender(Gender gender);

    List<Pet> findAllByBreed(String breed);

    List<Pet> findAllByLocation(String location);
}
