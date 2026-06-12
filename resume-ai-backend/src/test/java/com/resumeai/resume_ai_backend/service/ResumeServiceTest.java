package com.resumeai.resume_ai_backend.service;

import com.resumeai.resume_ai_backend.dto.ResumeDTO;
import com.resumeai.resume_ai_backend.entity.Resume;
import com.resumeai.resume_ai_backend.repository.ResumeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeServiceTest {

    @Mock
    private ResumeRepository resumeRepository;

    @InjectMocks
    private ResumeService resumeService;

    private Resume mockResume;
    private ResumeDTO mockDTO;

    @BeforeEach
    void setUp() {
        mockResume = new Resume("user123", "modern");
        mockResume.setId(1L);
        mockResume.setPersonalInfo("{\"name\":\"Sneha\"}");
        mockResume.setSummary("Java developer");

        mockDTO = new ResumeDTO();
        mockDTO.setUserId("user123");
        mockDTO.setTemplate("modern");
        mockDTO.setPersonalInfo("{\"name\":\"Sneha\"}");
        mockDTO.setSummary("Java developer");
    }

    @Test
    void createResume_shouldSaveAndReturnDTO() {
        when(resumeRepository.save(any(Resume.class))).thenReturn(mockResume);
        ResumeDTO result = resumeService.createResume(mockDTO);
        assertNotNull(result);
        assertEquals("user123", result.getUserId());
        assertEquals("modern", result.getTemplate());
        verify(resumeRepository, times(1)).save(any(Resume.class));
    }

    @Test
    void getResume_shouldReturnDTO_whenExists() {
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(mockResume));
        ResumeDTO result = resumeService.getResume(1L);
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getResume_shouldThrowException_whenNotFound() {
        when(resumeRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> resumeService.getResume(99L));
    }

    @Test
    void getAllResumesByUser_shouldReturnList() {
        when(resumeRepository.findByUserId("user123")).thenReturn(List.of(mockResume));
        List<ResumeDTO> result = resumeService.getAllResumesByUser("user123");
        assertEquals(1, result.size());
    }

    @Test
    void deleteResume_shouldCallRepository_whenExists() {
        when(resumeRepository.existsById(1L)).thenReturn(true);
        resumeService.deleteResume(1L);
        verify(resumeRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteResume_shouldThrowException_whenNotFound() {
        when(resumeRepository.existsById(99L)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> resumeService.deleteResume(99L));
    }
}
