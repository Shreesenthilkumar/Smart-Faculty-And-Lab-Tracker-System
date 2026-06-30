package com.facultytracker.dto.availability;

import com.facultytracker.entity.AvailabilityStatus;
import com.facultytracker.entity.FacultyLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityResponse {
    private Long availabilityId;
    private Long facultyId;
    private String facultyName;
    private AvailabilityStatus status;
    private FacultyLocation location;
    private LocalDateTime updatedTime;
}
