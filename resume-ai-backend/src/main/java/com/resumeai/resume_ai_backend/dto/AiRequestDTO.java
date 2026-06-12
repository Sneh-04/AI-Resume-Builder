package com.resumeai.resume_ai_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AiRequestDTO {
    @NotBlank(message = "Prompt cannot be blank")
    private String prompt;

    @NotBlank(message = "Section cannot be blank")
    private String section;

    private String resumeContext;
    private String tone;

    // Constructors
    public AiRequestDTO() {}

    public AiRequestDTO(String prompt, String section, String resumeContext, String tone) {
        this.prompt = prompt;
        this.section = section;
        this.resumeContext = resumeContext;
        this.tone = tone;
    }

    // Getters and Setters
    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getResumeContext() {
        return resumeContext;
    }

    public void setResumeContext(String resumeContext) {
        this.resumeContext = resumeContext;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }
}
