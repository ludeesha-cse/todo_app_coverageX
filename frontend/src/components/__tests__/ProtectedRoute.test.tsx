import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

// Mock the auth hook
const mockUseAuth = vi.fn();

vi.mock("../../services/auth", () => ({
  useAuth: () => mockUseAuth(),
}));

const TestComponent = () => <div>Protected Content</div>;

const renderProtectedRoute = () => {
  return render(
    <BrowserRouter>
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    </BrowserRouter>
  );
};

describe("ProtectedRoute", () => {
  it("renders children when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    renderProtectedRoute();

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("shows loading spinner when authentication is loading", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    renderProtectedRoute();

    // Check for loading spinner (the animated div)
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to signin when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    renderProtectedRoute();

    // The component should not render the protected content
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("does not show loading spinner when not loading and authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    renderProtectedRoute();

    const spinner = document.querySelector(".animate-spin");
    expect(spinner).not.toBeInTheDocument();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
