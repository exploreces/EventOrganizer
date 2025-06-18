package com.as.authservice.dtos;

import com.as.authservice.enums.Role;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String name;
    private String email;
    private String password;
    private Role role;
}
