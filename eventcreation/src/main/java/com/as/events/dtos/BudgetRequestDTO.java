package com.as.events.dtos;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetRequestDTO {
    private Long eventId;
    private String description;
    private BigDecimal cost;
}

