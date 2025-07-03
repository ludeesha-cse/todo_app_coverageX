const taskController = require("../../src/controllers/taskController");
const taskService = require("../../src/services/taskService");

// Mock dependencies
jest.mock("../../src/services/taskService");

describe("TaskController", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      params: {},
      userId: 1,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("createTask", () => {
    it("should create task successfully", async () => {
      mockReq.body = {
        title: "Test Task",
        description: "Test Description",
      };

      const mockTaskId = 123;
      taskService.createTask.mockResolvedValue(mockTaskId);

      await taskController.createTask(mockReq, mockRes);

      expect(taskService.createTask).toHaveBeenCalledWith(
        1,
        "Test Task",
        "Test Description"
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ taskId: mockTaskId });
    });

    it("should return 400 for missing title", async () => {
      mockReq.body = {
        description: "Test Description",
        // missing title
      };

      await taskController.createTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Title is required",
      });
    });

    it("should handle service errors", async () => {
      mockReq.body = {
        title: "Test Task",
        description: "Test Description",
      };

      taskService.createTask.mockRejectedValue(new Error("Database error"));

      await taskController.createTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Failed to create task",
      });
    });
  });

  describe("getTasks", () => {
    it("should get tasks successfully", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", completed: false },
        { id: 2, title: "Task 2", completed: false },
      ];

      taskService.getRecentIncompleteTasks.mockResolvedValue(mockTasks);

      await taskController.getTasks(mockReq, mockRes);

      expect(taskService.getRecentIncompleteTasks).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should handle service errors", async () => {
      taskService.getRecentIncompleteTasks.mockRejectedValue(
        new Error("Database error")
      );

      await taskController.getTasks(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Failed to fetch tasks",
      });
    });
  });

  describe("markAsDone", () => {
    it("should mark task as done successfully", async () => {
      mockReq.params.id = "123";

      taskService.markTaskAsDone.mockResolvedValue(true);

      await taskController.markAsDone(mockReq, mockRes);

      expect(taskService.markTaskAsDone).toHaveBeenCalledWith(1, 123);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Task marked as completed",
      });
    });

    it("should return 400 for invalid task ID", async () => {
      mockReq.params.id = "invalid";

      await taskController.markAsDone(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid task ID" });
    });

    it("should return 404 for task not found", async () => {
      mockReq.params.id = "123";

      taskService.markTaskAsDone.mockRejectedValue(
        new Error("Task not found or not owned by user")
      );

      await taskController.markAsDone(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Task not found or not owned by user",
      });
    });
  });
});
