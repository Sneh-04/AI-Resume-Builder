package com.resumeai.resume_ai_backend.dto;

public class AiResponseDTO {
    private String generatedContent;
    private String section;
    private long tokensUsed;
    private String model;

    // Constructors
    public AiResponseDTO() {}

    public AiResponseDTO(String generatedContent, String section, long tokensUsed, String model) {
        this.generatedContent = generatedContent;
        this.section = section;
        this.tokensUsed = tokensUsed;
        this.model = model;
    }

    // Getters and Setters
    public String getGeneratedContent() {
        return generatedContent;
    }

    public void setGeneratedContent(String generatedContent) {
        this.generatedContent = generatedContent;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public long getTokensUsed() {
        return tokensUsed;
    }

    public void setTokensUsed(long tokensUsed) {
        this.tokensUsed = tokensUsed;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}
