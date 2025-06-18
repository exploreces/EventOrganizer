package com.as.registration.controller;


import com.as.registration.dtos.FeedbackRequestDTO;
import com.as.registration.dtos.FeedbackResponseDTO;
import com.as.registration.security.JwtService;
import com.as.registration.services.interfaces.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final JwtService JwtUtil;

    @PostMapping
    public ResponseEntity<FeedbackResponseDTO> submitFeedback(
            @RequestBody FeedbackRequestDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        String email = JwtUtil.extractEmail(authHeader);
        return ResponseEntity.ok(feedbackService.submitFeedback(dto, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackResponseDTO> updateFeedback(
            @PathVariable Long id,
            @RequestBody FeedbackRequestDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        String email = JwtUtil.extractEmail(authHeader);
        return ResponseEntity.ok(feedbackService.updateFeedback(id, dto, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FeedbackResponseDTO>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<FeedbackResponseDTO>> getFeedbacksByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByEventId(eventId));
    }
}
