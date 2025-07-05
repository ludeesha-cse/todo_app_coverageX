import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiService } from "../api";
import type { LoginCredentials, SignupCredentials } from "../api";

// Mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("ApiService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockLocalStorage.clear.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("authentication methods", () => {
    it("login sends correct request and stores token", async () => {
      const mockResponse = {
        message: "Login successful",
        token: "test-token",
        user: { id: 1, name: "Test User", email: "test@example.com" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await apiService.login(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        })
      );

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "authToken",
        "test-token"
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(mockResponse.user)
      );
      expect(result).toEqual(mockResponse);
    });

    it("signup sends correct request and stores token", async () => {
      const mockResponse = {
        message: "Signup successful",
        token: "test-token",
        user: { id: 1, name: "Test User", email: "test@example.com" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const credentials: SignupCredentials = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const result = await apiService.signup(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/signup"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        })
      );

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "authToken",
        "test-token"
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(mockResponse.user)
      );
      expect(result).toEqual(mockResponse);
    });

    it("logout clears localStorage", () => {
      apiService.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("authToken");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
    });

    it("isAuthenticated returns true when token exists", () => {
      mockLocalStorage.getItem.mockReturnValue("test-token");

      const result = apiService.isAuthenticated();

      expect(result).toBe(true);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("authToken");
    });

    it("isAuthenticated returns false when token does not exist", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = apiService.isAuthenticated();

      expect(result).toBe(false);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("authToken");
    });

    it("getStoredUser returns parsed user when user exists in localStorage", () => {
      const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      const result = apiService.getStoredUser();

      expect(result).toEqual(mockUser);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("user");
    });

    it("getStoredUser returns null when user does not exist in localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = apiService.getStoredUser();

      expect(result).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("user");
    });
  });

  describe("task methods", () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue("test-token");
    });

    it("getTasks sends correct request with auth headers", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", description: "Description 1" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTasks),
      });

      const result = await apiService.getTasks();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks"),
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          },
        })
      );

      expect(result).toEqual(mockTasks);
    });

    it("createTask sends correct request with task data", async () => {
      const mockTask = {
        id: 1,
        title: "New Task",
        description: "New Description",
      };
      const taskData = { title: "New Task", description: "New Description" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTask),
      });

      const result = await apiService.createTask(taskData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          },
          body: JSON.stringify(taskData),
        })
      );

      expect(result).toEqual(mockTask);
    });

    it("markTaskAsDone sends correct request with task id", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: "Task marked as done" }),
      });

      await apiService.markTaskAsDone(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks/1/done"),
        expect.objectContaining({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          },
        })
      );
    });
  });

  describe("error handling", () => {
    it("throws error when response is not ok", async () => {
      const errorMessage = "Invalid credentials";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(
        apiService.login({ email: "test@test.com", password: "wrong" })
      ).rejects.toThrow(errorMessage);
    });

    it("throws generic error when response is not ok and no error message", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      await expect(
        apiService.login({ email: "test@test.com", password: "wrong" })
      ).rejects.toThrow("HTTP error! status: 500");
    });

    it("handles network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(
        apiService.login({ email: "test@test.com", password: "password" })
      ).rejects.toThrow("Network error");
    });
  });
});
