import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../App";

// Mock all the components and services
vi.mock("../Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../ProtectedRoute", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));

vi.mock("../../pages/Tasks", () => ({
  default: () => <div data-testid="tasks-page">Tasks Page</div>,
}));

vi.mock("../../pages/Sign-in", () => ({
  default: () => <div data-testid="signin-page">Sign In Page</div>,
}));

vi.mock("../../pages/Sign-up", () => ({
  default: () => <div data-testid="signup-page">Sign Up Page</div>,
}));

const mockUseAuth = vi.fn();

vi.mock("../../services/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  useAuth: () => mockUseAuth(),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="router">{children}</div>
  ),
  Routes: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="routes">{children}</div>
  ),
  Route: ({ element }: { element: React.ReactNode }) => (
    <div data-testid="route">{element}</div>
  ),
  Navigate: ({ to }: { to: string }) => (
    <div data-testid={`navigate-${to.replace("/", "")}`}>Navigate to {to}</div>
  ),
  useNavigate: () => mockNavigate,
}));

describe("App", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the main app structure", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<App />);

    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("router")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("renders navbar component", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<App />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("renders routes container", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<App />);

    expect(screen.getByTestId("routes")).toBeInTheDocument();
  });

  it("wraps content in proper container classes", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    });

    const { container } = render(<App />);

    // Check for container classes
    const containerDiv = container.querySelector(
      ".container.mx-auto.p-4.pt-20"
    );
    expect(containerDiv).toBeInTheDocument();
  });

  describe("App component structure", () => {
    it("provides auth context to the entire app", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
      });

      render(<App />);

      expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    });

    it("provides router context to the app content", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
      });

      render(<App />);

      expect(screen.getByTestId("router")).toBeInTheDocument();
    });

    it("renders all necessary components in correct order", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
      });

      render(<App />);

      // Auth provider should be the outermost
      const authProvider = screen.getByTestId("auth-provider");
      expect(authProvider).toBeInTheDocument();

      // Router should be inside auth provider
      const router = screen.getByTestId("router");
      expect(router).toBeInTheDocument();
      expect(authProvider).toContainElement(router);

      // Navbar should be rendered
      const navbar = screen.getByTestId("navbar");
      expect(navbar).toBeInTheDocument();
    });
  });
});
