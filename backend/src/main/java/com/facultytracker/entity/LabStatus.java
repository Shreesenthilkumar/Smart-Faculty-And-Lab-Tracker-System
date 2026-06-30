package com.facultytracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id")
    private Long statusId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_id", referencedColumnName = "lab_id", nullable = false, unique = true)
    private Lab lab;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LabOccupancyStatus status;

    @Column(name = "occupied_count", nullable = false)
    private Integer occupiedCount;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedTime = LocalDateTime.now();
    }
}
