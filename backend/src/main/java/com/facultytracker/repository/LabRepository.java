package com.facultytracker.repository;

import com.facultytracker.entity.Lab;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LabRepository extends JpaRepository<Lab, Long> {

    List<Lab> findByLabNameContainingIgnoreCase(String name);

    List<Lab> findByDepartment_DepartmentId(Long departmentId);

    Optional<Lab> findByLabIncharge_UserId(Long userId);
}
