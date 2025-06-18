package com.as.events.services.interfaces;


import com.as.events.dtos.PlannerRequestDTO;
import com.as.events.dtos.PlannerResponseDTO;

import java.util.List;

public interface PlannerService {
    PlannerResponseDTO createPlanner(PlannerRequestDTO dto);
    List<PlannerResponseDTO> getAllPlannersForEvent(Long eventId);
    PlannerResponseDTO updatePlanner(Long id, PlannerRequestDTO dto);
    void deletePlanner(Long id);
}

