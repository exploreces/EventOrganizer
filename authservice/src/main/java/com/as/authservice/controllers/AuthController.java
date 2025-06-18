package com.as.authservice.controllers;


import com.as.authservice.dtos.*;
import com.as.authservice.entity.User;
import com.as.authservice.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody RegisterRequestDTO request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/users/{email}")
    public ResponseEntity<User> login(@PathVariable("email")String email) {
        return ResponseEntity.ok(authService.getUser(String email));
    }
}

