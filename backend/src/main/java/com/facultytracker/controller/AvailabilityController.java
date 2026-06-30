package com.facultytracker.controller;

import com.facultytracker.dto.availability.AvailabilityResponse;
import com.facultytracker.dto.availability.AvailabilityUpdateRequest;
import com.facultytracker.dto.common.ApiResponse;
import com.facultytracker.security.UserPrincipal;
import com.facultytracker.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @GetMapping
    public ApiResponse<List<AvailabilityResponse>> getAll() {
        return ApiResponse.success(availabilityService.getAll());
    }

    @GetMapping("/{facultyId}")
    public ApiResponse<AvailabilityResponse> getByFacultyId(@PathVariable Long facultyId) {
        return ApiResponse.success(availabilityService.getByFacultyId(facultyId));
    }

    /** A logged-in faculty member updates their own status/location. */
    @PutMapping("/me")
    public ApiResponse<AvailabilityResponse> updateMine(@AuthenticationPrincipal UserPrincipal principal,
                                                          @Valid @RequestBody AvailabilityUpdateRequest request) {
        AvailabilityResponse updated = availabilityService.updateByUserId(principal.getUserId(), request);
        return ApiResponse.success("Availability updated", updated);
    }

    /** Admin overrides any faculty member's status directly by faculty_id. */
    @PutMapping("/{facultyId}")
    public ApiResponse<AvailabilityResponse> updateByFacultyId(@PathVariable Long facultyId,
                                                                @Valid @RequestBody AvailabilityUpdateRequest request) {
        AvailabilityResponse updated = availabilityService.updateByFacultyId(facultyId, request);
        return ApiResponse.success("Availability updated", updated);
    }
}
