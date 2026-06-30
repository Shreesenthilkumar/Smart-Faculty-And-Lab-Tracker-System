package com.facultytracker.dto.lab;

import com.facultytracker.entity.LabOccupancyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabResponse {
    private Long labId;
    private String labName;
    private Long departmentId;
    private String departmentName;
    private Integer capacity;
    private Long labInchargeUserId;
    private String labInchargeName;

    // current occupancy
    private LabOccupancyStatus status;
    private Integer occupiedCount;
    private LocalDateTime updatedTime;
}
