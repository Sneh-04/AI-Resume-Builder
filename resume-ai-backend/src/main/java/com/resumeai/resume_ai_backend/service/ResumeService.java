package com.resumeai.resume_ai_backend.service;

import com.resumeai.resume_ai_backend.dto.ResumeDTO;
import com.resumeai.resume_ai_backend.entity.Resume;
import com.resumeai.resume_ai_backend.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    public ResumeDTO createResume(ResumeDTO resumeDTO) {
        Resume resume = new Resume();
        resume.setUserId(resumeDTO.getUserId());
        resume.setTemplate(resumeDTO.getTemplate());
        resume.setPersonalInfo(resumeDTO.getPersonalInfo());
        resume.setSummary(resumeDTO.getSummary());
        resume.setExperience(resumeDTO.getExperience());
        resume.setEducation(resumeDTO.getEducation());
        resume.setSkills(resumeDTO.getSkills());
        resume.setProjects(resumeDTO.getProjects());
        
        Resume savedResume = resumeRepository.save(resume);
        return convertToDTO(savedResume);
    }

    public ResumeDTO getResume(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found with ID: " + id));
        return convertToDTO(resume);
    }

    public List<ResumeDTO> getAllResumesByUser(String userId) {
        return resumeRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ResumeDTO updateResume(Long id, ResumeDTO resumeDTO) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found with ID: " + id));
        
        if (resumeDTO.getPersonalInfo() != null) {
            resume.setPersonalInfo(resumeDTO.getPersonalInfo());
        }
        if (resumeDTO.getSummary() != null) {
            resume.setSummary(resumeDTO.getSummary());
        }
        if (resumeDTO.getExperience() != null) {
            resume.setExperience(resumeDTO.getExperience());
        }
        if (resumeDTO.getEducation() != null) {
            resume.setEducation(resumeDTO.getEducation());
        }
        if (resumeDTO.getSkills() != null) {
            resume.setSkills(resumeDTO.getSkills());
        }
        if (resumeDTO.getProjects() != null) {
            resume.setProjects(resumeDTO.getProjects());
        }
        if (resumeDTO.getTemplate() != null) {
            resume.setTemplate(resumeDTO.getTemplate());
        }
        
        Resume updatedResume = resumeRepository.save(resume);
        return convertToDTO(updatedResume);
    }

    public void deleteResume(Long id) {
        if (!resumeRepository.existsById(id)) {
            throw new RuntimeException("Resume not found with ID: " + id);
        }
        resumeRepository.deleteById(id);
    }

    public Long countResumesByUser(String userId) {
        return resumeRepository.countByUserId(userId);
    }

    private ResumeDTO convertToDTO(Resume resume) {
        return new ResumeDTO(
                resume.getId(),
                resume.getPersonalInfo(),
                resume.getSummary(),
                resume.getExperience(),
                resume.getEducation(),
                resume.getSkills(),
                resume.getProjects(),
                resume.getTemplate(),
                resume.getUserId(),
                resume.getCreatedAt(),
                resume.getUpdatedAt()
        );
    }
}
