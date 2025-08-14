package com.as.events.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BudgetStatusDTO {
    private BigDecimal assignedBudget;
    private BigDecimal totalSpent;
    private BigDecimal difference;
}
