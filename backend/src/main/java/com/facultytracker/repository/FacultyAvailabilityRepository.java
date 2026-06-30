package com.facultytracker.repository;

import com.facultytracker.entity.FacultyAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacultyAvailabilityRepository extends JpaRepository<FacultyAvailability, Long> {
    Optional<FacultyAvailability> findByFaculty_FacultyId(Long facultyId);
}
