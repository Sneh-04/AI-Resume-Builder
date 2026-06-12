package com.resumeai.service;

import com.resumeai.dto.AiRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnthropicService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Value("${anthropic.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public String generateSummary(AiRequestDTO request) {
        String prompt = buildSummaryPrompt(request);
        return callClaude(prompt);
    }

    public String generateBullets(AiRequestDTO request) {
        String prompt = buildBulletsPrompt(request);
        return callClaude(prompt);
    }

    private String callClaude(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);           // API key NEVER sent to browser
        headers.set("anthropic-version", "2023-06-01");
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "model", "claude-haiku-4-5",
            "max_tokens", 512,
            "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Object contentObj = response.getBody().get("content");
            if (contentObj instanceof List) {
                List<?> contentList = (List<?>) contentObj;
                if (!contentList.isEmpty() && contentList.get(0) instanceof Map) {
                    Object text = ((Map<?, ?>) contentList.get(0)).get("text");
                    return text != null ? text.toString() : "";
                }
            }
        }
        throw new RuntimeException("Failed to get response from Anthropic");
    }

    private String buildSummaryPrompt(AiRequestDTO req) {
        return String.format("""
            Write a 60-80 word ATS-friendly professional summary for:
            Name: %s | Title: %s | Years of experience: %s
            Key skills: %s
            Write in first person. Use strong action verbs. No bullet points.
            Return ONLY the summary text, nothing else.
            """, req.getName(), req.getTitle(), req.getYearsOfExperience(), req.getSkills());
    }

    private String buildBulletsPrompt(AiRequestDTO req) {
        return String.format("""
            Write 3 achievement-focused bullet points for this job role:
            Title: %s | Company: %s | Description: %s
            Rules: Start each with a strong action verb. Include metrics where possible.
            Format: Return exactly 3 lines, each starting with •
            """, req.getTitle(), req.getCompany(), req.getDescription());
    }
}
