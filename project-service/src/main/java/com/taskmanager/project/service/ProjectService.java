package com.taskmanager.project.service;

import com.taskmanager.project.client.TaskClient;
import com.taskmanager.project.dto.ProgressResponse;
import com.taskmanager.project.dto.ProjectRequest;
import com.taskmanager.project.dto.ProjectResponse;
import com.taskmanager.project.model.Project;
import com.taskmanager.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskClient taskClient;

    public ProjectService(ProjectRepository projectRepository, TaskClient taskClient) {
        this.projectRepository = projectRepository;
        this.taskClient = taskClient;
    }

    public List<ProjectResponse> getProjectsByUser(Long userId) {
        return projectRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponseWithProgress)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProject(Long id, Long userId) {
        Project project = projectRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return toResponseWithProgress(project);
    }

    public ProjectResponse createProject(ProjectRequest request, Long userId) {
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUserId(userId);
        
        project = projectRepository.save(project);
        return toResponse(project);
    }

    public ProjectResponse updateProject(Long id, ProjectRequest request, Long userId) {
        Project project = projectRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        
        project = projectRepository.save(project);
        return toResponseWithProgress(project);
    }

    public void deleteProject(Long id, Long userId) {
        Project project = projectRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.delete(project);
    }

    public ProgressResponse getProgress(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        try {
            TaskClient.TaskCountResponse count = taskClient.getTaskCount(projectId);
            double percentage = count.total() > 0 ? (count.completed() * 100.0 / count.total()) : 0;
            return new ProgressResponse(projectId, count.total(), count.completed(), percentage);
        } catch (Exception e) {
            return new ProgressResponse(projectId, 0, 0, 0);
        }
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getUserId(),
                project.getCreatedAt(),
                0, 0, 0
        );
    }

    private ProjectResponse toResponseWithProgress(Project project) {
        int totalTasks = 0;
        int completedTasks = 0;
        double progress = 0;
        
        try {
            TaskClient.TaskCountResponse count = taskClient.getTaskCount(project.getId());
            totalTasks = count.total();
            completedTasks = count.completed();
            progress = totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0;
        } catch (Exception e) {
            // Task service not available
        }
        
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getUserId(),
                project.getCreatedAt(),
                totalTasks,
                completedTasks,
                progress
        );
    }
}
