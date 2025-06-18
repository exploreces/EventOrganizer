package com.as.events.controllers;



import com.as.events.dtos.PlannerRequestDTO;
import com.as.events.dtos.PlannerResponseDTO;
import com.as.events.services.interfaces.PlannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planners")
@RequiredArgsConstructor
public class PlannerController {

    private final PlannerService plannerService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PlannerResponseDTO> createPlanner(@RequestBody PlannerRequestDTO dto) {
        return ResponseEntity.ok(plannerService.createPlanner(dto));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PlannerResponseDTO>> getAllForEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(plannerService.getAllPlannersForEvent(eventId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PlannerResponseDTO> updatePlanner(@PathVariable Long id,
                                                            @RequestBody PlannerRequestDTO dto) {
        return ResponseEntity.ok(plannerService.updatePlanner(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deletePlanner(@PathVariable Long id) {
        plannerService.deletePlanner(id);
        return ResponseEntity.noContent().build();
    }
}

