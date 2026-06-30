package com.facultytracker.service;

import com.facultytracker.dto.lab.LabResponse;
import com.facultytracker.dto.labstatus.LabStatusUpdateRequest;
import com.facultytracker.entity.Lab;
import com.facultytracker.entity.LabStatus;
import com.facultytracker.exception.ResourceNotFoundException;
import com.facultytracker.repository.LabStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LabStatusService {

    private final LabStatusRepository labStatusRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public LabResponse updateStatus(Long labId, LabStatusUpdateRequest request) {
        LabStatus status = labStatusRepository.findByLab_LabId(labId)
                .orElseThrow(() -> new ResourceNotFoundException("No status record for lab: " + labId));

        Lab lab = status.getLab();

        status.setStatus(request.getStatus());
        if (request.getOccupiedCount() != null) {
            status.setOccupiedCount(request.getOccupiedCount());
        }

        LabStatus saved = labStatusRepository.save(status);

        LabResponse response = LabResponse.builder()
                .labId(lab.getLabId())
                .labName(lab.getLabName())
                .departmentId(lab.getDepartment() != null ? lab.getDepartment().getDepartmentId() : null)
                .departmentName(lab.getDepartment() != null ? lab.getDepartment().getDepartmentName() : null)
                .capacity(lab.getCapacity())
                .labInchargeUserId(lab.getLabIncharge() != null ? lab.getLabIncharge().getUserId() : null)
                .labInchargeName(lab.getLabIncharge() != null ? lab.getLabIncharge().getName() : null)
                .status(saved.getStatus())
                .occupiedCount(saved.getOccupiedCount())
                .updatedTime(saved.getUpdatedTime())
                .build();

        // Push the change to every connected client (Phase 7 real-time updates)
        messagingTemplate.convertAndSend("/topic/lab-status", response);

        return response;
    }
}
