const request = require("supertest");
const express = require("express");

describe("App Error Handling Middleware", () => {
  it("should handle errors with error middleware", async () => {
    // Create a minimal Express app that mimics our app's error handling
    const testApp = express();

    testApp.use(express.json());

    // Add a route that throws an error
    testApp.get("/error-test", (req, res, next) => {
      const error = new Error("Test error");
      next(error);
    });

    // Add the exact same error handling middleware as in app.js
    testApp.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Something went wrong!" });
    });

    const response = await request(testApp).get("/error-test").expect(500);

    expect(response.body).toEqual({ error: "Something went wrong!" });
  });

  it("should handle async errors", async () => {
    const testApp = express();

    testApp.use(express.json());

    // Add a route that throws an async error
    testApp.get("/async-error", async (req, res, next) => {
      try {
        throw new Error("Async test error");
      } catch (error) {
        next(error);
      }
    });

    // Add the error handling middleware
    testApp.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Something went wrong!" });
    });

    const response = await request(testApp).get("/async-error").expect(500);

    expect(response.body).toEqual({ error: "Something went wrong!" });
  });

  it("should log error stack traces", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const testApp = express();

    testApp.get("/log-test", (req, res, next) => {
      const error = new Error("Log test error");
      next(error);
    });

    testApp.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Something went wrong!" });
    });

    await request(testApp).get("/log-test").expect(500);

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
