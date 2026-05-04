package com.edulink.studentservice.client;

import com.edulink.studentservice.dto.ApiResponse;
import com.edulink.studentservice.dto.AssignmentDto;
import com.edulink.studentservice.dto.LearningMaterialDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

@FeignClient(name = "course-service", url = "${course.service.url:http://localhost:8083}")
public interface CourseServiceClient {

    @GetMapping(value = "/course/student/materials/{courseCode}", consumes = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<List<LearningMaterialDto>> getMaterialsByCourseCode(
            @PathVariable("courseCode") String courseCode,
            @RequestHeader("Authorization") String authorization);

    @GetMapping(value = "/course/student/assignments/{courseCode}", consumes = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<List<AssignmentDto>> getAssignmentsByCourseCode(
            @PathVariable("courseCode") String courseCode,
            @RequestHeader("Authorization") String authorization);

    @GetMapping(value = "/student/courses/{courseId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    String courseExists(
            @PathVariable("courseId") Long courseId,
            @RequestHeader("Authorization") String authorization);

        @GetMapping(value = "/course/internal/course/by-code/{courseCode}", consumes = MediaType.APPLICATION_JSON_VALUE)
        Map<String, Object> getCourseByCourseCode(
            @PathVariable("courseCode") String courseCode,
            @RequestHeader("Authorization") String authorization);

        @GetMapping(value = "/course/internal/assignment/validate/{assignmentNum}/{courseCode}", consumes = MediaType.APPLICATION_JSON_VALUE)
    Map<String, Object> assignmentExists(
            @PathVariable("assignmentNum") Integer assignmentNum,
            @PathVariable("courseCode") String courseCode,
            @RequestHeader("Authorization") String authorization);

        @GetMapping(value = "/course/internal/courses", consumes = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<List<Map<String, Object>>> getAllCourses(
            @RequestHeader("Authorization") String authorization);
}
