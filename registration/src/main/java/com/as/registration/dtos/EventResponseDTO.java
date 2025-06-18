package com.as.registration.dtos;


import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String eventType;
    private LocalDate startDate;
    private LocalDate endDate;
}

