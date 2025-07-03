const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");

// Mock the database
jest.mock("../../src/utils/db");
const mockDb = require("../../src/utils/db");

// Mock data
const mockUsers = [];
const mockTasks = [];
let userIdCounter = 1;
let taskIdCounter = 1;

describe("User Authentication Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsers.length = 0;
    mockTasks.length = 0;
    userIdCounter = 1;
    taskIdCounter = 1;

    process.env.JWT_SECRET = "test-secret";
  });

  describe("POST /auth/signup", () => {
    it("should register a new user successfully", async () => {
      // Mock database responses
      mockDb.execute
        .mockResolvedValueOnce([[]]) // findByEmail - user doesn't exist
        .mockResolvedValueOnce([{ insertId: userIdCounter++ }]); // createUser

      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    it("should return 400 for missing fields", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send({
          name: "John Doe",
          email: "john@example.com",
          // missing password
        })
        .expect(400);

      expect(response.body).toEqual({ message: "All fields required" });
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send({
          name: "John Doe",
          email: "invalid-email",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toEqual({ message: "Invalid email format" });
    });

    it("should return 400 for existing email", async () => {
      // Mock database to return existing user
      mockDb.execute.mockResolvedValueOnce([
        [{ id: 1, email: "john@example.com" }],
      ]);

      const response = await request(app)
        .post("/auth/signup")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toEqual({ message: "Email already registered" });
    });
  });

  describe("POST /auth/login", () => {
    it("should login user successfully", async () => {
      // Mock database to return user with hashed password
      const hashedPassword = "$2b$10$mockHashedPassword";
      mockDb.execute.mockResolvedValueOnce([
        [
          {
            id: 1,
            email: "john@example.com",
            password_hash: hashedPassword,
          },
        ],
      ]);

      // Mock bcrypt to return true for password comparison
      const bcrypt = require("bcrypt");
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "john@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    it("should return 400 for missing credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "john@example.com",
          // missing password
        })
        .expect(400);

      expect(response.body).toEqual({ message: "Email and password required" });
    });

    it("should return 401 for invalid credentials", async () => {
      // Mock database to return no user
      mockDb.execute.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body).toEqual({ message: "Invalid credentials" });
    });
  });
});
