package com.taskmanager.project.dto;

public class ProgressResponse {
    private Long projectId;
    private int totalTasks;
    private int completedTasks;
    private double progressPercentage;

    public ProgressResponse() {}

    public ProgressResponse(Long projectId, int totalTasks, int completedTasks, double progressPercentage) {
        this.projectId = projectId;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.progressPercentage = progressPercentage;
    }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public int getTotalTasks() { return totalTasks; }
    public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }
    public int getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }
    public double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(double progressPercentage) { this.progressPercentage = progressPercentage; }
}
