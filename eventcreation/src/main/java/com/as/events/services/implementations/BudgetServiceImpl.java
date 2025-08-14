package com.as.events.services.implementations;

import com.as.events.dtos.BudgetRequestDTO;
import com.as.events.dtos.BudgetResponseDTO;
import com.as.events.dtos.BudgetStatusDTO;
import com.as.events.entity.Budget;
import com.as.events.entity.Event;
import com.as.events.exceptions.ResourceNotFoundException;
import com.as.events.repository.BudgetRepository;
import com.as.events.repository.EventRepository;
import com.as.events.services.interfaces.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final EventRepository eventRepository;

    @Override
    public BudgetResponseDTO createBudget(BudgetRequestDTO dto) {

        Event existEvent = eventRepository.findById(dto.getEventId()).orElseThrow(
                ()-> new ResourceNotFoundException("The Event does not exist!")
        );

        Budget budget = Budget.builder()
                .eventId(dto.getEventId())
                .description(dto.getDescription() != null ? dto.getDescription() : "NA")
                .cost(dto.getCost())
                .build();
        return mapToDTO(budgetRepository.save(budget));
    }

    @Override
    public BudgetResponseDTO updateBudget(Long id, BudgetRequestDTO dto) {
        Budget existing = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        existing.setEventId(dto.getEventId());
        existing.setDescription(dto.getDescription());
        existing.setCost(dto.getCost());

        return mapToDTO(budgetRepository.save(existing));
    }

    @Override
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }

    @Override
    public BudgetResponseDTO getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        return mapToDTO(budget);
    }

    @Override
    public List<BudgetResponseDTO> getBudgetsForEvent(Long eventId) {
        return budgetRepository.findByEventId(eventId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BudgetStatusDTO getBudgetUsageStatus(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Handle null budget safely
        Double budget = event.getBudget();
        BigDecimal assignedBudget = (budget != null)
                ? BigDecimal.valueOf(budget)
                : BigDecimal.ZERO;  // Default to zero if budget is null

        List<Budget> budgetItems = budgetRepository.findByEventId(eventId);

        // Handle null costs by filtering them out
        BigDecimal totalSpent = budgetItems.stream()
                .map(Budget::getCost)
                .filter(cost -> cost != null)  // Filter out null costs
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal difference = assignedBudget.subtract(totalSpent);

        return BudgetStatusDTO.builder()
                .assignedBudget(assignedBudget)
                .totalSpent(totalSpent)
                .difference(difference)
                .build();
    }

    public void updateEventBudget(Long eventId, Double budget) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setBudget(budget);
        eventRepository.save(event);
    }


    private BudgetResponseDTO mapToDTO(Budget budget) {
        return BudgetResponseDTO.builder()
                .id(budget.getId())
                .eventId(budget.getEventId())
                .description(budget.getDescription())
                .cost(budget.getCost())
                .build();
    }
}

