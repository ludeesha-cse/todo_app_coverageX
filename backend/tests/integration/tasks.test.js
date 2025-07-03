const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");

// Mock the database
jest.mock("../../src/utils/db");
const mockDb = require("../../src/utils/db");

describe("Task Management Integration Tests", () => {
  let authToken;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";

    // Create a valid auth token for testing
    authToken = jwt.sign({ userId: 1 }, "test-secret", { expiresIn: "1h" });
  });

  describe("POST /tasks", () => {
    it("should create a task successfully with authentication", async () => {
      mockDb.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test Task",
          description: "Test Description",
        })
        .expect(201);

      expect(response.body).toEqual({ taskId: 1 });
    });

    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({
          title: "Test Task",
          description: "Test Description",
        })
        .expect(401);

      expect(response.body).toEqual({
        message: "Unauthorized: No token provided",
      });
    });

    it("should return 400 for missing title", async () => {
      const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          description: "Test Description",
          // missing title
        })
        .expect(400);

      expect(response.body).toEqual({ message: "Title is required" });
    });
  });

  describe("GET /tasks", () => {
    it("should get tasks successfully with authentication", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Task 1",
          description: "Desc 1",
          completed: false,
          created_at: "2023-01-01",
        },
        {
          id: 2,
          title: "Task 2",
          description: "Desc 2",
          completed: false,
          created_at: "2023-01-02",
        },
      ];

      mockDb.execute.mockResolvedValueOnce([mockTasks]);

      const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual(mockTasks);
    });

    it("should return 401 without authentication", async () => {
      const response = await request(app).get("/tasks").expect(401);

      expect(response.body).toEqual({
        message: "Unauthorized: No token provided",
      });
    });
  });

  describe("PATCH /tasks/:id/done", () => {
    it("should mark task as done successfully", async () => {
      mockDb.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .patch("/tasks/1/done")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual({ message: "Task marked as completed" });
    });

    it("should return 401 without authentication", async () => {
      const response = await request(app).patch("/tasks/1/done").expect(401);

      expect(response.body).toEqual({
        message: "Unauthorized: No token provided",
      });
    });

    it("should return 400 for invalid task ID", async () => {
      const response = await request(app)
        .patch("/tasks/invalid/done")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toEqual({ message: "Invalid task ID" });
    });

    it("should return 404 for non-existent task", async () => {
      mockDb.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const response = await request(app)
        .patch("/tasks/999/done")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toEqual({
        message: "Task not found or not owned by user",
      });
    });
  });
});
