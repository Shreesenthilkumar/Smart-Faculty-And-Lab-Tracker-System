package com.facultytracker.repository;

import com.facultytracker.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Optional<Faculty> findByUser_UserId(Long userId);

    boolean existsByEmail(String email);

    List<Faculty> findByFacultyNameContainingIgnoreCase(String name);

    List<Faculty> findByDepartment_DepartmentId(Long departmentId);
}
