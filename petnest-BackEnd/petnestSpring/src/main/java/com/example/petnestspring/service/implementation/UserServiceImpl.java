package com.example.petnestspring.service.implementation;

import com.example.petnestspring.Entities.User;
import com.example.petnestspring.repository.UserRepository;

import com.example.petnestspring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;



    @Override
    public User getUserByUsername(String owner) {
        return userRepository.findByEmail(owner).orElseThrow(() -> new RuntimeException("User not found"));
    }
    @Override
    public void enableUser(String email){
        userRepository.enableUser(email);
    }
}
