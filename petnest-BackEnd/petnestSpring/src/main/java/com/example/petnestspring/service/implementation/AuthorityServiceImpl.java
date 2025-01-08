package com.example.petnestspring.service.implementation;

import com.example.petnestspring.Entities.User;
import com.example.petnestspring.service.AuthorityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorityServiceImpl implements AuthorityService {
    @Override
    public Boolean hasRole(String role) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getRoleEnum().name().equals(role);
    }
}
