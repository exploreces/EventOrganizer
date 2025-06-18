package com.as.registration.repository;

import com.as.registration.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    boolean existsByUserEmailAndEventId(String email, Long eventId);
    List<Registration> findByUserEmail(String email);
    List<Registration> findByEventId(Long eventId);
}

