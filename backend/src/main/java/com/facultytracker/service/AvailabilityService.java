package com.facultytracker.service;

import com.facultytracker.dto.availability.AvailabilityResponse;
import com.facultytracker.dto.availability.AvailabilityUpdateRequest;
import com.facultytracker.entity.Faculty;
import com.facultytracker.entity.FacultyAvailability;
import com.facultytracker.exception.ResourceNotFoundException;
import com.facultytracker.repository.FacultyAvailabilityRepository;
import com.facultytracker.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvailabilityService {

    private final FacultyAvailabilityRepository availabilityRepository;
    private final FacultyRepository facultyRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Get all faculty availability.
     */
    public List<AvailabilityResponse> getAll() {
        return availabilityRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Get availability using Faculty ID.
     */
    public AvailabilityResponse getByFacultyId(Long facultyId) {

        FacultyAvailability availability = availabilityRepository
                .findByFaculty_FacultyId(facultyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No availability record found for Faculty ID : " + facultyId));

        return toResponse(availability);
    }

    /**
     * Faculty updates his/her own status.
     */
    @Transactional
    public AvailabilityResponse updateByUserId(Long userId,
                                               AvailabilityUpdateRequest request) {

        Faculty faculty = facultyRepository
                .findByUser_UserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Faculty profile not found for logged-in user."));

        return updateByFacultyId(faculty.getFacultyId(), request);
    }

    /**
     * Admin updates any faculty status.
     */
    @Transactional
    public AvailabilityResponse updateByFacultyId(Long facultyId,
                                                  AvailabilityUpdateRequest request) {

        if (request.getStatus() == null) {
            throw new IllegalArgumentException("Status cannot be null.");
        }

        if (request.getLocation() == null) {
            throw new IllegalArgumentException("Location cannot be null.");
        }

        FacultyAvailability availability = availabilityRepository
                .findByFaculty_FacultyId(facultyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No availability record found for Faculty ID : " + facultyId));

        boolean changed = false;

        if (!Objects.equals(availability.getStatus(), request.getStatus())) {
            availability.setStatus(request.getStatus());
            changed = true;
        }

        if (!Objects.equals(availability.getLocation(), request.getLocation())) {
            availability.setLocation(request.getLocation());
            changed = true;
        }

        if (changed) {

            FacultyAvailability saved = availabilityRepository.save(availability);

            AvailabilityResponse response = toResponse(saved);

            // Broadcast latest status to all connected clients
            messagingTemplate.convertAndSend("/topic/faculty-status", response);

            log.info("Faculty {} status updated successfully.", facultyId);

            return response;
        }

        log.info("No changes detected for Faculty {}", facultyId);

        return toResponse(availability);
    }

    /**
     * Convert Entity to DTO.
     */
    private AvailabilityResponse toResponse(FacultyAvailability availability) {

        return AvailabilityResponse.builder()
                .availabilityId(availability.getAvailabilityId())
                .facultyId(availability.getFaculty().getFacultyId())
                .facultyName(availability.getFaculty().getFacultyName())
                .status(availability.getStatus())
                .location(availability.getLocation())
                .updatedTime(availability.getUpdatedTime())
                .build();
    }
}