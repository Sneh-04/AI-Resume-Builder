package com.resumeai.resume_ai_backend.controller;

import com.resumeai.resume_ai_backend.dto.ResumeDTO;
import com.resumeai.resume_ai_backend.service.ResumeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping
    public ResponseEntity<ResumeDTO> createResume(@Valid @RequestBody ResumeDTO resumeDTO) {
        ResumeDTO createdResume = resumeService.createResume(resumeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdResume);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeDTO> getResume(@PathVariable Long id) {
        ResumeDTO resume = resumeService.getResume(id);
        return ResponseEntity.ok(resume);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResumeDTO>> getUserResumes(@PathVariable String userId) {
        List<ResumeDTO> resumes = resumeService.getAllResumesByUser(userId);
        return ResponseEntity.ok(resumes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeDTO> updateResume(
            @PathVariable Long id,
            @Valid @RequestBody ResumeDTO resumeDTO) {
        ResumeDTO updatedResume = resumeService.updateResume(id, resumeDTO);
        return ResponseEntity.ok(updatedResume);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> countUserResumes(@PathVariable String userId) {
        Long count = resumeService.countResumesByUser(userId);
        return ResponseEntity.ok(count);
    }
}
