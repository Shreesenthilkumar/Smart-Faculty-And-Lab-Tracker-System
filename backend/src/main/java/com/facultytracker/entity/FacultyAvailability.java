package com.facultytracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "faculty_availability")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "availability_id")
    private Long availabilityId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", referencedColumnName = "faculty_id", nullable = false, unique = true)
    private Faculty faculty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AvailabilityStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FacultyLocation location;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedTime = LocalDateTime.now();
    }
}
