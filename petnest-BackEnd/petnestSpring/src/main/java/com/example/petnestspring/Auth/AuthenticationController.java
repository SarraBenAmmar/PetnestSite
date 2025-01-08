package com.example.petnestspring.Auth;

import com.example.petnestspring.Entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authenticationService.register(registerRequest));
    }

    @GetMapping(path = "/confirm")
    public String confirm(@RequestParam("token") String token) {
        return authenticationService.confirmToken(token);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticateRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @GetMapping("checkJwtValidity/{token}")
    public Boolean checkJwtValidity(@PathVariable String token) {
        return authenticationService.checkIfTokenIsValid(token);
    }

    @GetMapping("getUserInformations/{token}")
    public User getUserInformations(@PathVariable String token) {
        return authenticationService.getUserInformations(token);
    }
}
