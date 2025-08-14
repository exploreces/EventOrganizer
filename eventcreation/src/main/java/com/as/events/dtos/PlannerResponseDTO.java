package com.as.events.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlannerResponseDTO {

    private Long id;
    private String title;
    private String note;
    private Long eventId;
    private String createdBy;
}
