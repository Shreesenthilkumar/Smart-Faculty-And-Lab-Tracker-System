package com.facultytracker.dto.faculty;

import com.facultytracker.entity.AvailabilityStatus;
import com.facultytracker.entity.FacultyLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Combines faculty profile + current availability so the Search and
 * Faculty List screens can render everything a student needs in one call.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyResponse {
    private Long facultyId;
    private String facultyName;
    private String email;
    private Long departmentId;
    private String departmentName;
    private String cabinNumber;
    private String phone;

    // current availability (may be null if not yet set)
    private AvailabilityStatus status;
    private FacultyLocation location;
    private LocalDateTime updatedTime;
}
