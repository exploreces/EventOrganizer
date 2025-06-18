package com.as.authservice.dtos;

import lombok.*;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private String email;
    private String token;
}