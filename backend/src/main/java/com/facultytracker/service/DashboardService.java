package com.facultytracker.service;

import com.facultytracker.dto.dashboard.DashboardResponse;
import com.facultytracker.entity.AvailabilityStatus;
import com.facultytracker.entity.LabOccupancyStatus;
import com.facultytracker.repository.FacultyAvailabilityRepository;
import com.facultytracker.repository.LabStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FacultyAvailabilityRepository availabilityRepository;
    private final LabStatusRepository labStatusRepository;

    public DashboardResponse getSummary() {
        var availabilities = availabilityRepository.findAll();
        var labStatuses = labStatusRepository.findAll();

        long available = availabilities.stream().filter(a -> a.getStatus() == AvailabilityStatus.AVAILABLE).count();
        long busy = availabilities.stream().filter(a -> a.getStatus() == AvailabilityStatus.BUSY).count();
        long inClass = availabilities.stream().filter(a -> a.getStatus() == AvailabilityStatus.IN_CLASS).count();
        long inMeeting = availabilities.stream().filter(a -> a.getStatus() == AvailabilityStatus.IN_MEETING).count();
        long onLeave = availabilities.stream().filter(a -> a.getStatus() == AvailabilityStatus.ON_LEAVE).count();

        long free = labStatuses.stream().filter(l -> l.getStatus() == LabOccupancyStatus.FREE).count();
        long occupied = labStatuses.stream().filter(l -> l.getStatus() == LabOccupancyStatus.OCCUPIED).count();
        long maintenance = labStatuses.stream().filter(l -> l.getStatus() == LabOccupancyStatus.MAINTENANCE).count();

        return DashboardResponse.builder()
                .totalFaculty(availabilities.size())
                .availableFaculty(available)
                .busyFaculty(busy)
                .inClassFaculty(inClass)
                .inMeetingFaculty(inMeeting)
                .onLeaveFaculty(onLeave)
                .totalLabs(labStatuses.size())
                .freeLabs(free)
                .occupiedLabs(occupied)
                .maintenanceLabs(maintenance)
                .build();
    }
}
