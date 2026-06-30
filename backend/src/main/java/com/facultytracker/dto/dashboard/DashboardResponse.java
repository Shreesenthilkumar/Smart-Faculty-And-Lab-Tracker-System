package com.facultytracker.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private long totalFaculty;
    private long availableFaculty;
    private long busyFaculty;
    private long inClassFaculty;
    private long inMeetingFaculty;
    private long onLeaveFaculty;

    private long totalLabs;
    private long freeLabs;
    private long occupiedLabs;
    private long maintenanceLabs;
}
