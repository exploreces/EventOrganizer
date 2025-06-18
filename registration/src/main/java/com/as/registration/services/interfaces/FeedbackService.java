package com.as.registration.services.interfaces;

import com.as.registration.dtos.FeedbackRequestDTO;
import com.as.registration.dtos.FeedbackResponseDTO;

import java.util.List;

public interface FeedbackService {
    FeedbackResponseDTO submitFeedback(FeedbackRequestDTO dto, String userEmail);
    FeedbackResponseDTO updateFeedback(Long id, FeedbackRequestDTO dto, String userEmail);
    void deleteFeedback(Long id);
    List<FeedbackResponseDTO> getAllFeedbacks();
    List<FeedbackResponseDTO> getFeedbacksByEventId(Long eventId);
}


