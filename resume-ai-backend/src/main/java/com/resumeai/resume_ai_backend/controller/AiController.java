package com.resumeai.resume_ai_backend.controller;

import com.resumeai.resume_ai_backend.dto.AiRequestDTO;
import com.resumeai.resume_ai_backend.dto.AiResponseDTO;
import com.resumeai.resume_ai_backend.service.AnthropicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AnthropicService anthropicService;

    @PostMapping("/generate")
    public ResponseEntity<AiResponseDTO> generateContent(@Valid @RequestBody AiRequestDTO request) {
        try {
            AiResponseDTO response = anthropicService.generateContent(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/rewrite")
    public ResponseEntity<AiResponseDTO> rewriteContent(@Valid @RequestBody AiRequestDTO request) {
        try {
            AiResponseDTO response = anthropicService.generateContent(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI service is healthy");
    }
}
