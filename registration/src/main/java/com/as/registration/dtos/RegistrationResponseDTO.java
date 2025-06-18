package com.as.registration.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RegistrationResponseDTO {
    private Long id;
    private String userEmail;
    private Long eventId;
    private LocalDateTime registeredAt;
}

