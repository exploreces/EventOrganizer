package com.as.events.services.interfaces;

import com.as.events.dtos.EventRequestDTO;
import com.as.events.dtos.EventResponseDTO;

import java.util.List;

public interface EventService {
    EventResponseDTO createEvent(EventRequestDTO dto);
    EventResponseDTO updateEvent(Long id, EventRequestDTO dto);
    EventResponseDTO getEventById(Long id);
    List<EventResponseDTO> getAllEvents();
    void deleteEvent(Long id);
}

