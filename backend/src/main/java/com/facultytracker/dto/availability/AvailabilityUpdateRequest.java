package com.facultytracker.dto.availability;

import com.facultytracker.entity.AvailabilityStatus;
import com.facultytracker.entity.FacultyLocation;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AvailabilityUpdateRequest {

    @NotNull(message = "Status is required")
    private AvailabilityStatus status;

    @NotNull(message = "Location is required")
    private FacultyLocation location;
}
