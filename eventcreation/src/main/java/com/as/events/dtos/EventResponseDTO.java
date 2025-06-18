package com.as.events.dtos;

import com.as.events.enums.EventType;
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
    private EventType eventType;
    private LocalDate startDate;
    private LocalDate endDate;
}

