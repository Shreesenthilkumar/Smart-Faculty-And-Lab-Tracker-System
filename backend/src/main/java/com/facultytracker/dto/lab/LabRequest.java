package com.facultytracker.dto.lab;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class LabRequest {

    @NotBlank(message = "Lab name is required")
    private String labName;

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    /** Optional: user_id of the LAB_INCHARGE login that manages this lab */
    private Long labInchargeUserId;
}
