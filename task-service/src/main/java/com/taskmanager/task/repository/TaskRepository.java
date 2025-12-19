package com.taskmanager.task.repository;

import com.taskmanager.task.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    int countByProjectId(Long projectId);
    int countByProjectIdAndCompleted(Long projectId, boolean completed);
    void deleteByProjectId(Long projectId);
}
