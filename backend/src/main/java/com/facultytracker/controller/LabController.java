package com.facultytracker.controller;

import com.facultytracker.dto.common.ApiResponse;
import com.facultytracker.dto.lab.LabRequest;
import com.facultytracker.dto.lab.LabResponse;
import com.facultytracker.dto.labstatus.LabStatusUpdateRequest;
import com.facultytracker.service.LabService;
import com.facultytracker.service.LabStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
@RequiredArgsConstructor
public class LabController {

    private final LabService labService;
    private final LabStatusService labStatusService;

    /** Module 7: student search — GET /api/labs?name=network */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LabResponse>>> getAll(
            @RequestParam(required = false) String name) {
        return ResponseEntity.ok(ApiResponse.success(labService.search(name)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LabResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(labService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LabResponse>> create(@Valid @RequestBody LabRequest request) {
        LabResponse created = labService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Lab created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LabResponse>> update(@PathVariable Long id,
                                                            @Valid @RequestBody LabRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lab updated", labService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        labService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Lab deleted", null));
    }

    /** Lab Incharge / Admin: update occupancy status — Module 6. */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LabResponse>> updateStatus(@PathVariable Long id,
                                                                  @Valid @RequestBody LabStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lab status updated", labStatusService.updateStatus(id, request)));
    }
}
