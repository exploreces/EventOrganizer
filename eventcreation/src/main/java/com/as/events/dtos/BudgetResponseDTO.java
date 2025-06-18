package com.as.events.dtos;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetResponseDTO {
    private Long id;
    private Long eventId;
    private String description;
    private BigDecimal cost;
}
