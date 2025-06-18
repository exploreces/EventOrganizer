package com.as.events.services.implementations;


import com.as.events.dtos.EventRequestDTO;
import com.as.events.dtos.EventResponseDTO;
import com.as.events.entity.Event;
import com.as.events.exceptions.ResourceNotFoundException;
import com.as.events.repository.EventRepository;
import com.as.events.services.interfaces.EventService;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository repository;
    private final ObjectMapper objectMapper;

    @Override
    public EventResponseDTO createEvent(EventRequestDTO dto) {
        Event event = objectMapper.convertValue(dto, Event.class);
        Event saved = repository.save(event);
        return objectMapper.convertValue(saved, EventResponseDTO.class);
    }

    @Override
    public EventResponseDTO updateEvent(Long id, EventRequestDTO dto) {
        Event existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setEventType(dto.getEventType());
        existing.setBudget(dto.getBudget());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());

        Event updated = repository.save(existing);
        return objectMapper.convertValue(updated, EventResponseDTO.class);
    }

    @Override
    public EventResponseDTO getEventById(Long id) {
        Event event = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return objectMapper.convertValue(event, EventResponseDTO.class);
    }

    @Override
    public List<EventResponseDTO> getAllEvents() {
        return repository.findAll().stream()
                .map(event -> objectMapper.convertValue(event, EventResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteEvent(Long id) {
        Event event = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        repository.deleteById(event.getId());
    }
}
