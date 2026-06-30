package com.facultytracker.controller;

import com.facultytracker.dto.common.ApiResponse;
import com.facultytracker.dto.faculty.FacultyRequest;
import com.facultytracker.dto.faculty.FacultyResponse;
import com.facultytracker.service.FacultyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    /** Module 7: student search — GET /api/faculty?name=ramesh */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FacultyResponse>>> getAll(
            @RequestParam(required = false) String name) {
        return ResponseEntity.ok(ApiResponse.success(facultyService.search(name)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultyResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(facultyService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FacultyResponse>> create(@Valid @RequestBody FacultyRequest request) {
        FacultyResponse created = facultyService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Faculty created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultyResponse>> update(@PathVariable Long id,
                                                                @Valid @RequestBody FacultyRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Faculty updated", facultyService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        facultyService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Faculty deleted", null));
    }
}
