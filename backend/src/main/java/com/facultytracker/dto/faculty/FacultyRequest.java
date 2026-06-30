package com.facultytracker.dto.faculty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FacultyRequest {

    @NotBlank(message = "Faculty name is required")
    private String facultyName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotNull(message = "Department is required")
    private Long departmentId;

    private String cabinNumber;

    private String phone;

    /** Optional: link this profile to an existing login (FACULTY role) user_id */
    private Long userId;
}
