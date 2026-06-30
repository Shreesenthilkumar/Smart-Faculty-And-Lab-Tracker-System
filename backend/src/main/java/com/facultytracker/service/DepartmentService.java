package com.facultytracker.service;

import com.facultytracker.dto.department.DepartmentRequest;
import com.facultytracker.dto.department.DepartmentResponse;
import com.facultytracker.entity.Department;
import com.facultytracker.exception.DuplicateResourceException;
import com.facultytracker.exception.ResourceNotFoundException;
import com.facultytracker.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByDepartmentNameIgnoreCase(request.getDepartmentName())) {
            throw new DuplicateResourceException("Department already exists: " + request.getDepartmentName());
        }
        Department department = Department.builder()
                .departmentName(request.getDepartmentName())
                .build();
        return toResponse(departmentRepository.save(department));
    }

    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));
        department.setDepartmentName(request.getDepartmentName());
        return toResponse(departmentRepository.save(department));
    }

    public void delete(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found: " + id);
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentResponse toResponse(Department department) {
        return DepartmentResponse.builder()
                .departmentId(department.getDepartmentId())
                .departmentName(department.getDepartmentName())
                .build();
    }
}
