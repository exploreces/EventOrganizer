package com.as.registration.clients;

import com.as.registration.dtos.EventResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "EVENTSERVICE", url = "http://localhost:8081")
public interface EventClient {

    @GetMapping("/api/events/{id}")
    public EventResponseDTO getEventById(@PathVariable("id") Long id);
}

