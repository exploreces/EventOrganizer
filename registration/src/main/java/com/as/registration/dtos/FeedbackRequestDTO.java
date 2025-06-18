package com.as.registration.dtos;

import lombok.Data;

@Data
public class FeedbackRequestDTO {
    private int stars;
    private String message;
    private Long eventId;
}

