package com.as.events.dtos;


import lombok.Data;

@Data
public class PlannerRequestDTO {
    private String title;
    private String note;
    private Long eventId;
    private String createdBy;
}

