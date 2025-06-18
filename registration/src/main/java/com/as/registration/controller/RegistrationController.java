package com.as.registration.controller;

import com.as.registration.dtos.RegistrationRequestDTO;
import com.as.registration.dtos.RegistrationResponseDTO;
import com.as.registration.services.interfaces.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<RegistrationResponseDTO> register(
            @RequestHeader("Authorization") String token,
            @RequestBody RegistrationRequestDTO request) {
        return ResponseEntity.ok(registrationService.register(token, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<RegistrationResponseDTO>> getMyRegistrations(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(registrationService.getRegistrationsForUser(token));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RegistrationResponseDTO>> getEventRegistrations(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsForEvent(eventId));
    }
}
