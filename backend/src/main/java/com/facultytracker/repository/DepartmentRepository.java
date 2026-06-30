package com.facultytracker.repository;

import com.facultytracker.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByDepartmentNameIgnoreCase(String departmentName);
}
