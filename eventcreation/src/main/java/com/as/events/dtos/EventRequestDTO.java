package com.as.events.dtos;

import com.as.events.enums.EventType;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRequestDTO {
    private String name;
    private String description;
    private EventType eventType;
    private Double budget;
    private LocalDate startDate;
    private LocalDate endDate;
}

