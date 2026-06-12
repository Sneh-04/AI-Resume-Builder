package com.resumeai.resume_ai_backend.repository;

import com.resumeai.resume_ai_backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserId(String userId);
    Long countByUserId(String userId);
}
