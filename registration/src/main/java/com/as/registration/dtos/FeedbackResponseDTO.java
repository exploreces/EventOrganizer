package com.as.registration.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeedbackResponseDTO {
    private Long id;
    private int stars;
    private String message;
    private String userEmail;
    private Long eventId;
}

