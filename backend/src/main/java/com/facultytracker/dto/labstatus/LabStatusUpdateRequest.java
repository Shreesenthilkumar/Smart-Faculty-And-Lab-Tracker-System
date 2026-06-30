package com.facultytracker.dto.labstatus;

import com.facultytracker.entity.LabOccupancyStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LabStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private LabOccupancyStatus status;

    @Min(value = 0, message = "Occupied count cannot be negative")
    private Integer occupiedCount;
}
