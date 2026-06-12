package com.resumeai.controller;

import com.resumeai.dto.ResumeDTO;
import com.resumeai.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Validated
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<?> save(@Valid @RequestBody ResumeDTO dto) {
        return ResponseEntity.ok(resumeService.save(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.ok(resumeService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody ResumeDTO dto) {
        return ResponseEntity.ok(resumeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        resumeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
