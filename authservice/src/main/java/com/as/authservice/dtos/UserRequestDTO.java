package com.as.authservice.dtos;


    import lombok.*;

    @Data
    public class UserRequestDTO {
        private String email;
        private String password;
    }

