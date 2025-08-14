package com.as.events.controllers;

import com.as.events.dtos.BudgetRequestDTO;
import com.as.events.dtos.BudgetResponseDTO;
import com.as.events.dtos.BudgetStatusDTO;
import com.as.events.services.interfaces.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<BudgetResponseDTO> addTasks(@RequestBody BudgetRequestDTO dto) {
        return ResponseEntity.ok(budgetService.createBudget(dto));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponseDTO> updateTasks(@PathVariable Long id, @RequestBody BudgetRequestDTO dto) {
        return ResponseEntity.ok(budgetService.updateBudget(id, dto));
    }

    @PutMapping("/events/{eventId}/budget")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> updateEventBudget(
            @PathVariable Long eventId,
            @RequestBody Map<String, Double> payload) {
        budgetService.updateEventBudget(eventId, payload.get("budget"));
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTasks(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<BudgetResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @GetMapping("/events/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<BudgetResponseDTO>> getAllByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(budgetService.getBudgetsForEvent(eventId));
    }

    @GetMapping("/budget/status/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<BudgetStatusDTO> getBudgetStatus(@PathVariable Long eventId) {
        return ResponseEntity.ok(budgetService.getBudgetUsageStatus(eventId));
    }

}
