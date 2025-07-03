const request = require("supertest");
const app = require("../../src/app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Mock dependencies
jest.mock("../../src/utils/db", () => ({
  execute: jest.fn(),
  query: jest.fn(),
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const db = require("../../src/utils/db");

describe("E2E User Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("Complete user journey", () => {
    it("should handle complete user flow: signup -> login -> create task -> get tasks", async () => {
      // Setup mocks for user registration
      db.execute
        .mockResolvedValueOnce([[], {}]) // No existing user (findByEmail)
        .mockResolvedValueOnce([{ insertId: 1 }, {}]); // User created (createUser)

      bcrypt.hash.mockResolvedValue("hashedPassword");
      jwt.sign.mockReturnValue("mock-token");

      // Sign up
      const signupResponse = await request(app).post("/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(signupResponse.status).toBe(201);
      expect(signupResponse.body).toHaveProperty("token");

      // Mock user login
      db.execute.mockResolvedValueOnce([
        [
          {
            id: 1,
            email: "test@example.com",
            password_hash: "$2b$10$mockhashedpassword",
          },
        ],
        {},
      ]);

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("login-token");

      // Login
      const loginResponse = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty("token");

      const token = loginResponse.body.token;

      // Mock JWT verification for authenticated requests
      jwt.verify.mockReturnValue({ userId: 1 });

      // Mock task creation
      db.execute.mockResolvedValueOnce([{ insertId: 1 }, {}]);

      // Create task
      const createTaskResponse = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          description: "Test Description",
        });

      expect(createTaskResponse.status).toBe(201);
      expect(createTaskResponse.body).toHaveProperty("taskId");

      // Mock get tasks
      db.execute.mockResolvedValueOnce([
        [
          {
            id: 1,
            title: "Test Task",
            description: "Test Description",
            status: "pending",
            user_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {},
      ]);

      // Get tasks
      const getTasksResponse = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(getTasksResponse.status).toBe(200);
      expect(getTasksResponse.body).toHaveLength(1);
      expect(getTasksResponse.body[0].title).toBe("Test Task");
    });
  });

  describe("Error handling", () => {
    it("should handle 404 for non-existent routes", async () => {
      const response = await request(app).get("/api/non-existent-route");

      expect(response.status).toBe(404);
    });

    it("should handle unauthorized access to protected routes", async () => {
      const response = await request(app).get("/tasks");

      expect(response.status).toBe(401);
    });

    it("should handle invalid JWT token", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .get("/tasks")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(403);
    });

    it("should handle malformed request body", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "test@example.com",
        // Missing name and password
      });

      expect(response.status).toBe(400);
    });

    it("should handle database connection errors", async () => {
      // Mock database error
      db.execute.mockRejectedValueOnce(new Error("Database connection failed"));

      const response = await request(app).post("/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
    });
  });

  describe("Task operations error handling", () => {
    beforeEach(() => {
      // Mock valid user for token verification
      jwt.verify.mockReturnValue({ userId: 1 });
    });

    it("should handle invalid task ID for marking as done", async () => {
      const response = await request(app)
        .patch("/tasks/invalid-id/done")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid task ID");
    });

    it("should handle task not found when marking as done", async () => {
      // Mock task service to return empty result for non-existent task
      db.execute.mockResolvedValueOnce([[], {}]); // No task found

      const response = await request(app)
        .patch("/tasks/999/done")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(404);
    });

    it("should handle unauthorized task access", async () => {
      // Mock different user ID for token verification
      jwt.verify.mockReturnValue({ userId: 2 });

      // Mock task that belongs to user 1 - when user 2 tries to access it, markAsDone returns false
      db.execute.mockResolvedValueOnce([{ affectedRows: 0 }, {}]); // No rows affected

      const response = await request(app)
        .patch("/tasks/1/done")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(404);
    });
  });

  describe("Data validation", () => {
    it("should handle invalid email format during signup", async () => {
      const response = await request(app).post("/auth/signup").send({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      });

      expect(response.status).toBe(400);
    });

    it("should handle weak password during signup", async () => {
      const response = await request(app).post("/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "123",
      });

      expect(response.status).toBe(400);
    });

    it("should handle missing task title", async () => {
      jwt.verify.mockReturnValue({ userId: 1 });

      const response = await request(app)
        .post("/tasks")
        .set("Authorization", "Bearer valid-token")
        .send({
          description: "Test Description",
          // Missing title
        });

      expect(response.status).toBe(400);
    });

    it("should handle empty task title", async () => {
      jwt.verify.mockReturnValue({ userId: 1 });

      const response = await request(app)
        .post("/tasks")
        .set("Authorization", "Bearer valid-token")
        .send({
          title: "",
          description: "Test Description",
        });

      expect(response.status).toBe(400);
    });
  });
});
