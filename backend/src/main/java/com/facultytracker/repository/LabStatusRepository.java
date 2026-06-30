package com.facultytracker.repository;

import com.facultytracker.entity.LabStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LabStatusRepository extends JpaRepository<LabStatus, Long> {
    Optional<LabStatus> findByLab_LabId(Long labId);
}
