package com.example.petnestspring.service;

import com.example.petnestspring.Entities.User;

public interface UserService {
    User getUserByUsername(String owner);
    void enableUser(String email);
}
