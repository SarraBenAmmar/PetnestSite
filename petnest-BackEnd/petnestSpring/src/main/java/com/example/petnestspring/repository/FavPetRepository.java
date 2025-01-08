package com.example.petnestspring.repository;

import com.example.petnestspring.Entities.User;
import com.example.petnestspring.Entities.favPet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavPetRepository extends JpaRepository<favPet,Long> {
    Optional<favPet> findByUser(User user);
}
