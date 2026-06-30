package com.facultytracker.service;

import com.facultytracker.dto.lab.LabRequest;
import com.facultytracker.dto.lab.LabResponse;
import com.facultytracker.entity.Department;
import com.facultytracker.entity.Lab;
import com.facultytracker.entity.LabOccupancyStatus;
import com.facultytracker.entity.LabStatus;
import com.facultytracker.entity.User;
import com.facultytracker.exception.ResourceNotFoundException;
import com.facultytracker.repository.DepartmentRepository;
import com.facultytracker.repository.LabRepository;
import com.facultytracker.repository.LabStatusRepository;
import com.facultytracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LabService {

    private final LabRepository labRepository;
    private final LabStatusRepository labStatusRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public List<LabResponse> getAll() {
        return labRepository.findAll().stream().map(this::toResponse).toList();
    }

    public LabResponse getById(Long id) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab not found: " + id));
        return toResponse(lab);
    }

    public List<LabResponse> search(String name) {
        if (name == null || name.isBlank()) {
            return getAll();
        }
        return labRepository.findByLabNameContainingIgnoreCase(name).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public LabResponse create(LabRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + request.getDepartmentId()));

        Lab.LabBuilder builder = Lab.builder()
                .labName(request.getLabName())
                .department(department)
                .capacity(request.getCapacity());

        if (request.getLabInchargeUserId() != null) {
            User incharge = userRepository.findById(request.getLabInchargeUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getLabInchargeUserId()));
            builder.labIncharge(incharge);
        }

        Lab saved = labRepository.save(builder.build());

        // Every lab starts FREE with zero occupancy until updated.
        LabStatus status = LabStatus.builder()
                .lab(saved)
                .status(LabOccupancyStatus.FREE)
                .occupiedCount(0)
                .build();
        labStatusRepository.save(status);

        return toResponse(saved);
    }

    @Transactional
    public LabResponse update(Long id, LabRequest request) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab not found: " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + request.getDepartmentId()));

        lab.setLabName(request.getLabName());
        lab.setDepartment(department);
        lab.setCapacity(request.getCapacity());

        if (request.getLabInchargeUserId() != null) {
            User incharge = userRepository.findById(request.getLabInchargeUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getLabInchargeUserId()));
            lab.setLabIncharge(incharge);
        } else {
            lab.setLabIncharge(null);
        }

        return toResponse(labRepository.save(lab));
    }

    public void delete(Long id) {
        if (!labRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lab not found: " + id);
        }
        labRepository.deleteById(id);
    }

    private LabResponse toResponse(Lab lab) {
        Optional<LabStatus> status = labStatusRepository.findByLab_LabId(lab.getLabId());

        LabResponse.LabResponseBuilder builder = LabResponse.builder()
                .labId(lab.getLabId())
                .labName(lab.getLabName())
                .capacity(lab.getCapacity());

        if (lab.getDepartment() != null) {
            builder.departmentId(lab.getDepartment().getDepartmentId());
            builder.departmentName(lab.getDepartment().getDepartmentName());
        }

        if (lab.getLabIncharge() != null) {
            builder.labInchargeUserId(lab.getLabIncharge().getUserId());
            builder.labInchargeName(lab.getLabIncharge().getName());
        }

        status.ifPresent(s -> builder
                .status(s.getStatus())
                .occupiedCount(s.getOccupiedCount())
                .updatedTime(s.getUpdatedTime()));

        return builder.build();
    }
}
