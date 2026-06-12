package com.resumeai.resume_ai_backend.service;

import com.resumeai.resume_ai_backend.dto.AiRequestDTO;
import com.resumeai.resume_ai_backend.dto.AiResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnthropicService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Value("${anthropic.api.url:https://api.anthropic.com/v1/messages}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AnthropicService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public AiResponseDTO generateContent(AiRequestDTO request) {
        try {
            String prompt = buildPrompt(request);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "claude-3-5-sonnet-20241022");
            requestBody.put("max_tokens", 1024);
            
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            requestBody.put("messages", new Object[]{message});

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            Map<String, Object> response = restTemplate.postForObject(apiUrl, entity, Map.class);
            
            if (response != null && response.containsKey("content")) {
                java.util.List<Map<String, Object>> content = (java.util.List<Map<String, Object>>) response.get("content");
                if (!content.isEmpty()) {
                    String generatedText = (String) content.get(0).get("text");
                    
                    long tokensUsed = 0;
                    if (response.containsKey("usage")) {
                        Map<String, Object> usage = (Map<String, Object>) response.get("usage");
                        Object totalTokens = usage.get("output_tokens");
                        tokensUsed = totalTokens instanceof Number ? ((Number) totalTokens).longValue() : 0;
                    }
                    
                    return new AiResponseDTO(generatedText, request.getSection(), tokensUsed, "claude-3-5-sonnet-20241022");
                }
            }

            throw new RuntimeException("Invalid response from Anthropic API");
        } catch (Exception e) {
            throw new RuntimeException("Error calling Anthropic API: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(AiRequestDTO request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert resume writer and career coach.\n\n");
        
        if (request.getResumeContext() != null && !request.getResumeContext().isEmpty()) {
            prompt.append("Resume context:\n").append(request.getResumeContext()).append("\n\n");
        }
        
        if (request.getTone() != null && !request.getTone().isEmpty()) {
            prompt.append("Tone: ").append(request.getTone()).append("\n");
        }
        
        prompt.append("Section: ").append(request.getSection()).append("\n");
        prompt.append("User request: ").append(request.getPrompt()).append("\n\n");
        prompt.append("Generate professional, concise, and impactful content for the specified section. Keep it to 2-3 sentences max.");
        
        return prompt.toString();
    }
}
