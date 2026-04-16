package com.edulink.courseservice.repository;

import com.edulink.courseservice.entity.LearningMaterial;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LearningMaterialRepository extends MongoRepository<LearningMaterial, String> {
    List<LearningMaterial> findByCourseCode(String courseCode);
    void deleteByFileId(String fileId);
}
