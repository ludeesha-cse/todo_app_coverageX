const request = require("supertest");

describe("App.js Error Middleware Coverage", () => {
  let app;

  beforeEach(() => {
    // Reset modules to get a fresh app instance
    jest.resetModules();

    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, "error").mockImplementation(() => {});

    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should trigger error handling middleware in app.js", async () => {
    // First, let's mock our database
    jest.doMock("../../src/utils/db", () => ({
      execute: jest.fn(),
    }));

    // Create a failing task controller that will call next(error)
    jest.doMock("../../src/controllers/taskController", () => ({
      createTask: (req, res, next) => {
        // Simulate an unhandled error that should trigger error middleware
        const error = new Error("Database connection failed");
        next(error);
      },
      getTasks: jest.fn(),
      markAsDone: jest.fn(),
    }));

    // Mock JWT to pass authentication
    const jwt = require("jsonwebtoken");
    jwt.verify = jest.fn().mockReturnValue({ userId: 1 });

    // Now require the app after mocking
    app = require("../../src/app");

    const response = await request(app)
      .post("/tasks")
      .set("Authorization", "Bearer valid-token")
      .send({
        title: "Test Task",
        description: "This should trigger error middleware",
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Something went wrong!" });
    expect(console.error).toHaveBeenCalled();
  });

  it("should handle malformed JSON errors", async () => {
    // Reset modules again for fresh app
    jest.resetModules();

    jest.doMock("../../src/utils/db", () => ({
      execute: jest.fn(),
    }));

    app = require("../../src/app");

    // Send malformed JSON to trigger built-in Express error
    const response = await request(app)
      .post("/auth/signup")
      .set("Content-Type", "application/json")
      .send("{ invalid json }");

    // Express handles malformed JSON with our error middleware
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Something went wrong!" });
  });
});
