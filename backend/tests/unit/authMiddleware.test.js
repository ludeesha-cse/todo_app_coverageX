const jwt = require("jsonwebtoken");
const authMiddleware = require("../../src/middlewares/authMiddleware");

// Mock dependencies
jest.mock("jsonwebtoken");

describe("AuthMiddleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      headers: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    process.env.JWT_SECRET = "test-secret";
  });

  it("should authenticate valid token successfully", () => {
    mockReq.headers.authorization = "Bearer valid-token";
    jwt.verify.mockReturnValue({ userId: 1 });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
    expect(mockReq.userId).toBe(1);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 for missing authorization header", () => {
    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Unauthorized: No token provided",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 for malformed authorization header", () => {
    mockReq.headers.authorization = "Invalid token-format";

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Unauthorized: No token provided",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 for invalid token", () => {
    mockReq.headers.authorization = "Bearer invalid-token";
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Forbidden: Invalid token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 for expired token", () => {
    mockReq.headers.authorization = "Bearer expired-token";
    jwt.verify.mockImplementation(() => {
      throw new Error("Token expired");
    });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Forbidden: Invalid token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
