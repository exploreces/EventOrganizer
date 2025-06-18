package com.as.registration.services.implementations;

import com.as.registration.clients.EventClient;
import com.as.registration.dtos.EventResponseDTO;
import com.as.registration.dtos.RegistrationRequestDTO;
import com.as.registration.dtos.RegistrationResponseDTO;
import com.as.registration.entity.Registration;
import com.as.registration.exceptions.InvalidDataException;
import com.as.registration.exceptions.ResourceNotFoundException;
import com.as.registration.repository.RegistrationRepository;
import com.as.registration.security.JwtService;
import com.as.registration.services.interfaces.RegistrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.runtime.ObjectMethods;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final JwtService jwtService;
    private final RegistrationRepository registrationRepository;
    private final EventClient eventClient;
    private final ObjectMapper objectMapper;

    @Override
    public RegistrationResponseDTO register(String jwtToken, RegistrationRequestDTO request) {
        String email = jwtService.extractEmail(jwtToken.substring(7));

        EventResponseDTO existEvent = eventClient.getEventById(request.getEventId());


        if (registrationRepository.existsByUserEmailAndEventId(email, request.getEventId())) {
            throw new InvalidDataException("Already registered");
        }

        Registration saved = registrationRepository.save(
                Registration.builder()
                        .eventId(request.getEventId())
                        .userEmail(email)
                        .registeredAt(LocalDateTime.now())
                        .build()
        );

        return toDto(saved);
    }

    @Override
    public List<RegistrationResponseDTO> getRegistrationsForUser(String jwtToken) {
        String email = jwtService.extractEmail(jwtToken.substring(7));
        return registrationRepository.findByUserEmail(email)
                .stream().map(this::toDto).toList();
    }


    @Override
    public List<RegistrationResponseDTO> getRegistrationsForEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId)
                .stream().map(this::toDto).toList();
    }


    private RegistrationResponseDTO toDto(Registration reg) {
        return objectMapper.convertValue(reg , RegistrationResponseDTO.class);
    }

}

