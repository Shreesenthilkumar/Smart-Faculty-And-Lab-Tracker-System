package com.facultytracker.service;

import com.facultytracker.dto.faculty.FacultyRequest;
import com.facultytracker.dto.faculty.FacultyResponse;
import com.facultytracker.entity.AvailabilityStatus;
import com.facultytracker.entity.Department;
import com.facultytracker.entity.Faculty;
import com.facultytracker.entity.FacultyAvailability;
import com.facultytracker.entity.FacultyLocation;
import com.facultytracker.entity.User;
import com.facultytracker.exception.DuplicateResourceException;
import com.facultytracker.exception.ResourceNotFoundException;
import com.facultytracker.repository.DepartmentRepository;
import com.facultytracker.repository.FacultyAvailabilityRepository;
import com.facultytracker.repository.FacultyRepository;
import com.facultytracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final FacultyAvailabilityRepository availabilityRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public List<FacultyResponse> getAll() {
        return facultyRepository.findAll().stream().map(this::toResponse).toList();
    }

    public FacultyResponse getById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found: " + id));
        return toResponse(faculty);
    }

    public List<FacultyResponse> search(String name) {
        if (name == null || name.isBlank()) {
            return getAll();
        }
        return facultyRepository.findByFacultyNameContainingIgnoreCase(name).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public FacultyResponse create(FacultyRequest request) {
        if (facultyRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("A faculty profile with this email already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + request.getDepartmentId()));

        Faculty.FacultyBuilder builder = Faculty.builder()
                .facultyName(request.getFacultyName())
                .email(request.getEmail())
                .department(department)
                .cabinNumber(request.getCabinNumber())
                .phone(request.getPhone());

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));
            builder.user(user);
        }

        Faculty saved = facultyRepository.save(builder.build());

        // Every faculty profile starts with a default availability row so
        // search/list screens always have a status to show.
        FacultyAvailability availability = FacultyAvailability.builder()
                .faculty(saved)
                .status(AvailabilityStatus.AVAILABLE)
                .location(FacultyLocation.CABIN)
                .build();
        availabilityRepository.save(availability);

        return toResponse(saved);
    }

    @Transactional
    public FacultyResponse update(Long id, FacultyRequest request) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found: " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + request.getDepartmentId()));

        faculty.setFacultyName(request.getFacultyName());
        faculty.setEmail(request.getEmail());
        faculty.setDepartment(department);
        faculty.setCabinNumber(request.getCabinNumber());
        faculty.setPhone(request.getPhone());

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));
            faculty.setUser(user);
        }

        return toResponse(facultyRepository.save(faculty));
    }

    public void delete(Long id) {
        if (!facultyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Faculty not found: " + id);
        }
        facultyRepository.deleteById(id);
    }

    private FacultyResponse toResponse(Faculty faculty) {
        Optional<FacultyAvailability> availability = availabilityRepository.findByFaculty_FacultyId(faculty.getFacultyId());

        FacultyResponse.FacultyResponseBuilder builder = FacultyResponse.builder()
                .facultyId(faculty.getFacultyId())
                .facultyName(faculty.getFacultyName())
                .email(faculty.getEmail())
                .cabinNumber(faculty.getCabinNumber())
                .phone(faculty.getPhone());

        if (faculty.getDepartment() != null) {
            builder.departmentId(faculty.getDepartment().getDepartmentId());
            builder.departmentName(faculty.getDepartment().getDepartmentName());
        }

        availability.ifPresent(a -> builder
                .status(a.getStatus())
                .location(a.getLocation())
                .updatedTime(a.getUpdatedTime()));

        return builder.build();
    }
}
