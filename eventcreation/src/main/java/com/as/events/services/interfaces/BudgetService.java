package com.as.events.services.interfaces;


import com.as.events.dtos.BudgetRequestDTO;
import com.as.events.dtos.BudgetResponseDTO;
import com.as.events.dtos.BudgetStatusDTO;

import java.util.List;

public interface BudgetService {
    BudgetResponseDTO createBudget(BudgetRequestDTO dto);
    BudgetResponseDTO updateBudget(Long id, BudgetRequestDTO dto);
    void deleteBudget(Long id);
    BudgetResponseDTO getBudgetById(Long id);
    List<BudgetResponseDTO> getBudgetsForEvent(Long eventId);
    BudgetStatusDTO getBudgetUsageStatus(Long eventId);
    void updateEventBudget(Long eventId, Double budget);
}

