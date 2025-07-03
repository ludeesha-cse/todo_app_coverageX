const taskService = require("../../src/services/taskService");
const taskModel = require("../../src/models/taskModel");

// Mock dependencies
jest.mock("../../src/models/taskModel");

describe("TaskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const userId = 1;
      const title = "Test Task";
      const description = "Test Description";
      const mockTaskId = 123;

      taskModel.createTask.mockResolvedValue(mockTaskId);

      const result = await taskService.createTask(userId, title, description);

      expect(taskModel.createTask).toHaveBeenCalledWith({
        userId,
        title,
        description,
      });
      expect(result).toBe(mockTaskId);
    });

    it("should handle missing description", async () => {
      const userId = 1;
      const title = "Test Task";
      const mockTaskId = 123;

      taskModel.createTask.mockResolvedValue(mockTaskId);

      const result = await taskService.createTask(userId, title);

      expect(taskModel.createTask).toHaveBeenCalledWith({
        userId,
        title,
        description: undefined,
      });
      expect(result).toBe(mockTaskId);
    });
  });

  describe("getRecentIncompleteTasks", () => {
    it("should return incomplete tasks for user", async () => {
      const userId = 1;
      const mockTasks = [
        { id: 1, title: "Task 1", description: "Desc 1", completed: false },
        { id: 2, title: "Task 2", description: "Desc 2", completed: false },
      ];

      taskModel.getIncompleteTasks.mockResolvedValue(mockTasks);

      const result = await taskService.getRecentIncompleteTasks(userId);

      expect(taskModel.getIncompleteTasks).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockTasks);
    });

    it("should return empty array when no tasks found", async () => {
      const userId = 1;

      taskModel.getIncompleteTasks.mockResolvedValue([]);

      const result = await taskService.getRecentIncompleteTasks(userId);

      expect(result).toEqual([]);
    });
  });

  describe("markTaskAsDone", () => {
    it("should mark task as done successfully", async () => {
      const userId = 1;
      const taskId = 123;

      taskModel.markAsDone.mockResolvedValue(true);

      const result = await taskService.markTaskAsDone(userId, taskId);

      expect(taskModel.markAsDone).toHaveBeenCalledWith(taskId, userId);
      expect(result).toBe(true);
    });

    it("should throw error when task not found or not owned by user", async () => {
      const userId = 1;
      const taskId = 123;

      taskModel.markAsDone.mockResolvedValue(false);

      await expect(taskService.markTaskAsDone(userId, taskId)).rejects.toThrow(
        "Task not found or not owned by user"
      );
    });
  });
});
