package com.taskmanager.project.client;

import com.taskmanager.project.dto.TaskResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "task-service")
public interface TaskClient {
    
    @GetMapping("/project/{projectId}")
    List<TaskResponse> getTasksByProjectId(@PathVariable Long projectId);
    
    @GetMapping("/project/{projectId}/count")
    TaskCountResponse getTaskCount(@PathVariable Long projectId);
    
    record TaskCountResponse(int total, int completed) {}
}
