const userController = require("../../src/controllers/userController");
const userService = require("../../src/services/userService");

// Mock dependencies
jest.mock("../../src/services/userService");

describe("UserController", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("signup", () => {
    it("should create user successfully", async () => {
      mockReq.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const mockToken = "mock-jwt-token";
      userService.registerUser.mockResolvedValue(mockToken);

      await userController.signup(mockReq, mockRes);

      expect(userService.registerUser).toHaveBeenCalledWith(
        "John Doe",
        "john@example.com",
        "password123"
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it("should return 400 for missing fields", async () => {
      mockReq.body = {
        name: "John Doe",
        email: "john@example.com",
        // missing password
      };

      await userController.signup(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "All fields required",
      });
    });

    it("should return 400 for email already exists error", async () => {
      mockReq.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      userService.registerUser.mockRejectedValue(
        new Error("Email already registered")
      );

      await userController.signup(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Email already registered",
      });
    });

    it("should return 500 for server error", async () => {
      mockReq.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      userService.registerUser.mockRejectedValue(new Error("Database error"));

      await userController.signup(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      mockReq.body = {
        email: "john@example.com",
        password: "password123",
      };

      const mockToken = "mock-jwt-token";
      userService.authenticateUser.mockResolvedValue(mockToken);

      await userController.login(mockReq, mockRes);

      expect(userService.authenticateUser).toHaveBeenCalledWith(
        "john@example.com",
        "password123"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it("should return 400 for missing email", async () => {
      mockReq.body = {
        password: "password123",
        // missing email
      };

      await userController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Email and password required",
      });
    });

    it("should return 401 for invalid credentials", async () => {
      mockReq.body = {
        email: "john@example.com",
        password: "wrongpassword",
      };

      userService.authenticateUser.mockRejectedValue(
        new Error("Invalid credentials")
      );

      await userController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return 500 for server error", async () => {
      mockReq.body = {
        email: "john@example.com",
        password: "password123",
      };

      userService.authenticateUser.mockRejectedValue(
        new Error("Database connection failed")
      );

      await userController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Database connection failed",
      });
    });
  });
});
