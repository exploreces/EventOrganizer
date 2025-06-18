package com.as.registration.services.implementations;


import com.as.registration.dtos.FeedbackRequestDTO;
import com.as.registration.dtos.FeedbackResponseDTO;
import com.as.registration.entity.Feedback;
import com.as.registration.exceptions.InvalidDataException;
import com.as.registration.exceptions.ResourceNotFoundException;
import com.as.registration.repository.FeedbackRepository;
import com.as.registration.services.interfaces.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Override
    public FeedbackResponseDTO submitFeedback(FeedbackRequestDTO dto, String userEmail) {
        Feedback feedback = Feedback.builder()
                .stars(dto.getStars())
                .message(dto.getMessage())
                .eventId(dto.getEventId())
                .userEmail(userEmail)
                .build();
        return toDto(feedbackRepository.save(feedback));
    }

    @Override
    public FeedbackResponseDTO updateFeedback(Long id, FeedbackRequestDTO dto, String userEmail) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        if (!feedback.getUserEmail().equals(userEmail)) {
            throw new InvalidDataException("You cannot edit this feedback");
        }

        feedback.setStars(dto.getStars());
        feedback.setMessage(dto.getMessage());
        feedback.setEventId(dto.getEventId());
        return toDto(feedbackRepository.save(feedback));
    }

    @Override
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    @Override
    public List<FeedbackResponseDTO> getAllFeedbacks() {
        return feedbackRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<FeedbackResponseDTO> getFeedbacksByEventId(Long eventId) {
        return feedbackRepository.findByEventId(eventId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private FeedbackResponseDTO toDto(Feedback feedback) {
        return FeedbackResponseDTO.builder()
                .id(feedback.getId())
                .stars(feedback.getStars())
                .message(feedback.getMessage())
                .userEmail(feedback.getUserEmail())
                .eventId(feedback.getEventId())
                .build();
    }
}
