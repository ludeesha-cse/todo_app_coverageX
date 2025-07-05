import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../auth";
import type { ReactNode } from "react";

// Mock the API service
vi.mock("../api", () => ({
  apiService: {
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
    getStoredUser: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}));

import { apiService } from "../api";
const mockApiService = vi.mocked(apiService);

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthProvider and useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useAuth hook", () => {
    it("throws error when used outside AuthProvider", () => {
      // Mock console.error to avoid error output in tests
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleSpy.mockRestore();
    });

    it("provides auth context when used within AuthProvider", () => {
      mockApiService.getStoredUser.mockReturnValue(null);
      mockApiService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty("user");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("login");
      expect(result.current).toHaveProperty("signup");
      expect(result.current).toHaveProperty("logout");
      expect(result.current).toHaveProperty("isAuthenticated");
    });
  });

  describe("AuthProvider", () => {
    it("initializes with stored user if authenticated", async () => {
      const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
      mockApiService.getStoredUser.mockReturnValue(mockUser);
      mockApiService.isAuthenticated.mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("initializes with no user if not authenticated", async () => {
      mockApiService.getStoredUser.mockReturnValue(null);
      mockApiService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("manages loading state correctly during initialization", async () => {
      mockApiService.getStoredUser.mockReturnValue(null);
      mockApiService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // In test environment, useEffect runs synchronously,
      // so loading is false after initialization
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("auth methods", () => {
    it("login calls apiService.login and updates user state", async () => {
      const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
      const mockResponse = {
        message: "Login successful",
        token: "test-token",
        user: mockUser,
      };

      mockApiService.getStoredUser.mockReturnValue(null);
      mockApiService.isAuthenticated.mockReturnValue(false);
      mockApiService.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const credentials = { email: "test@example.com", password: "password" };

      await act(async () => {
        await result.current.login(credentials);
      });

      expect(mockApiService.login).toHaveBeenCalledWith(credentials);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("signup calls apiService.signup and updates user state", async () => {
      const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
      const mockResponse = {
        message: "Signup successful",
        token: "test-token",
        user: mockUser,
      };

      mockApiService.getStoredUser.mockReturnValue(null);
      mockApiService.isAuthenticated.mockReturnValue(false);
      mockApiService.signup.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const credentials = {
        name: "Test User",
        email: "test@example.com",
        password: "password",
      };

      await act(async () => {
        await result.current.signup(credentials);
      });

      expect(mockApiService.signup).toHaveBeenCalledWith(credentials);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("logout calls apiService.logout and clears user state", async () => {
      const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
      mockApiService.getStoredUser.mockReturnValue(mockUser);
      mockApiService.isAuthenticated.mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.logout();
      });

      expect(mockApiService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("login throws error when apiService.login fails", async () => {
      const errorMessage = "Invalid credentials";
      mockApiService.getStoredUser.mockReturnValue(null);
      mockApiService.isAuthenticated.mockReturnValue(false);
      mockApiService.login.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const credentials = { email: "test@example.com", password: "wrong" };

      await expect(
        act(async () => {
          await result.current.login(credentials);
        })
      ).rejects.toThrow(errorMessage);

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("signup throws error when apiService.signup fails", async () => {
      const errorMessage = "Email already exists";
      mockApiService.getStoredUser.mockReturnValue(null);
      mockApiService.isAuthenticated.mockReturnValue(false);
      mockApiService.signup.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const credentials = {
        name: "Test User",
        email: "test@example.com",
        password: "password",
      };

      await expect(
        act(async () => {
          await result.current.signup(credentials);
        })
      ).rejects.toThrow(errorMessage);

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("isAuthenticated computed value", () => {
    it("returns true when user is present", async () => {
      const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
      mockApiService.getStoredUser.mockReturnValue(mockUser);
      mockApiService.isAuthenticated.mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("returns false when user is null", async () => {
      mockApiService.getStoredUser.mockReturnValue(null);
      mockApiService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
