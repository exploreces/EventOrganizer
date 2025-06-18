package com.as.events.services.implementations;

import com.as.events.dtos.PlannerRequestDTO;
import com.as.events.dtos.PlannerResponseDTO;
import com.as.events.entity.Planner;
import com.as.events.exceptions.ResourceNotFoundException;
import com.as.events.repository.EventRepository;
import com.as.events.repository.PlannerRepository;
import com.as.events.services.interfaces.PlannerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlannerServiceImpl implements PlannerService {

    private final PlannerRepository plannerRepository;
    private final EventRepository eventRepository;
    private final ObjectMapper objectMapper;

    @Override
    public PlannerResponseDTO createPlanner(PlannerRequestDTO dto) {
        eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Planner not found"));

        Planner planner = Planner.builder()
                .title(dto.getTitle())
                .note(dto.getNote())
                .eventId(dto.getEventId())
                .createdBy(dto.getCreatedBy())
                .build();

        planner = plannerRepository.save(planner);
        return toDto(planner);
    }

    @Override
    public List<PlannerResponseDTO> getAllPlannersForEvent(Long eventId) {
        return plannerRepository.findByEventId(eventId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public PlannerResponseDTO updatePlanner(Long id, PlannerRequestDTO dto) {
        Planner planner = plannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Planner not found"));

        planner.setTitle(dto.getTitle());
        planner.setNote(dto.getNote());
        planner.setCreatedBy(dto.getCreatedBy());

        return toDto(plannerRepository.save(planner));
    }

    @Override
    public void deletePlanner(Long id) {
        plannerRepository.deleteById(id);
    }

    private PlannerResponseDTO toDto(Planner planner) {
        return objectMapper.convertValue(planner, PlannerResponseDTO.class);
    }
}
