package com.as.registration.services.interfaces;

import com.as.registration.dtos.RegistrationRequestDTO;
import com.as.registration.dtos.RegistrationResponseDTO;

import java.util.List;

public interface RegistrationService {
    RegistrationResponseDTO register(String jwtToken, RegistrationRequestDTO request);
    List<RegistrationResponseDTO> getRegistrationsForUser(String jwtToken);
    List<RegistrationResponseDTO> getRegistrationsForEvent(Long eventId);
}

