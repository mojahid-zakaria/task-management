package com.taskmanager.task.dto;

public class TaskCountResponse {
    private int total;
    private int completed;

    public TaskCountResponse() {}

    public TaskCountResponse(int total, int completed) {
        this.total = total;
        this.completed = completed;
    }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    public int getCompleted() { return completed; }
    public void setCompleted(int completed) { this.completed = completed; }
}
