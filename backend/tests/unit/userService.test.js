const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../../src/services/userService");
const userModel = require("../../src/models/userModel");

// Mock dependencies
jest.mock("../../src/models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      userModel.findByEmail.mockResolvedValue(null);
      userModel.createUser.mockResolvedValue(1);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      jwt.sign.mockReturnValue("mock-token");

      const result = await userService.registerUser(
        userData.name,
        userData.email,
        userData.password
      );

      expect(userModel.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(userModel.createUser).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        passwordHash: "hashedPassword",
      });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, "test-secret", {
        expiresIn: "1d",
      });
      expect(result).toBe("mock-token");
    });

    it("should throw error for invalid email format", async () => {
      await expect(
        userService.registerUser("John", "invalid-email", "password")
      ).rejects.toThrow("Invalid email format");
    });

    it("should throw error if email already exists", async () => {
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        email: "john@example.com",
      });

      await expect(
        userService.registerUser("John", "john@example.com", "password")
      ).rejects.toThrow("Email already registered");
    });
  });

  describe("authenticateUser", () => {
    it("should authenticate user successfully", async () => {
      const user = {
        id: 1,
        email: "john@example.com",
        password_hash: "hashedPassword",
      };

      userModel.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mock-token");

      const result = await userService.authenticateUser(
        "john@example.com",
        "password"
      );

      expect(userModel.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, "test-secret", {
        expiresIn: "1d",
      });
      expect(result).toBe("mock-token");
    });

    it("should throw error for non-existent user", async () => {
      userModel.findByEmail.mockResolvedValue(null);

      await expect(
        userService.authenticateUser("john@example.com", "password")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error for wrong password", async () => {
      const user = {
        id: 1,
        email: "john@example.com",
        password_hash: "hashedPassword",
      };

      userModel.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.authenticateUser("john@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
