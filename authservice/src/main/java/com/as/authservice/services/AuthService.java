package com.as.authservice.services;

import com.as.authservice.dtos.RegisterRequestDTO;
import com.as.authservice.dtos.UserRequestDTO;
import com.as.authservice.dtos.UserResponseDTO;
import com.as.authservice.entity.User;
import com.as.authservice.enums.Role;
import com.as.authservice.exceptions.InvalidDataException;
import com.as.authservice.exceptions.ResourceNotFoundException;
import com.as.authservice.repository.UserRepository;
import com.as.authservice.security.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class AuthService {
    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;


    public UserResponseDTO register(RegisterRequestDTO request) {
        Optional<User> existUser = repository.findByEmail(request.getEmail());

        if(existUser.isPresent()){
            throw new InvalidDataException("The email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .build();
        repository.save(user);

        String jwt = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new UserResponseDTO(user.getEmail() ,jwt);
    }


    public UserResponseDTO login(UserRequestDTO request) {
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidDataException("Invalid password");
        }

        String jwt = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new UserResponseDTO(user.getEmail(), jwt);
    }

    public User getUser(String email) {
        User user = repository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User does not exist"));
        return user;
    }
}
