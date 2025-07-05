import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../Navbar";
import { mockUser } from "../../test/mocks";

// Mock the auth hook
const mockUseAuth = vi.fn();
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock("../../services/auth", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe("Navbar", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseLocation.mockReturnValue({ pathname: "/" });
  });

  it("renders TaskFlow brand link", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    renderNavbar();

    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
    const brandLink = screen.getByRole("link", { name: /taskflow/i });
    expect(brandLink).toHaveAttribute("href", "/");
  });

  describe("when user is authenticated", () => {
    const mockLogout = vi.fn();

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: mockLogout,
      });
      mockLogout.mockClear();
    });

    it("displays user greeting", () => {
      renderNavbar();

      expect(screen.getByText(`Hello, ${mockUser.name}`)).toBeInTheDocument();
    });

    it("displays logout button", () => {
      renderNavbar();

      const logoutButton = screen.getByRole("button", { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it("calls logout and navigates on logout button click", () => {
      renderNavbar();

      const logoutButton = screen.getByRole("button", { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });

    it("does not display sign in or sign up buttons", () => {
      renderNavbar();

      expect(
        screen.queryByRole("button", { name: /sign in/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /sign up/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("when user is not authenticated", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: vi.fn(),
      });
    });

    it("does not display user greeting", () => {
      renderNavbar();

      expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
    });

    it("does not display logout button", () => {
      renderNavbar();

      expect(
        screen.queryByRole("button", { name: /logout/i })
      ).not.toBeInTheDocument();
    });

    it("displays sign in link when not on signin page", () => {
      mockUseLocation.mockReturnValue({ pathname: "/" });
      renderNavbar();

      const signInLink = screen.getByRole("link", { name: /sign in/i });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute("href", "/signin");
    });

    it("displays sign up link when not on signup page", () => {
      mockUseLocation.mockReturnValue({ pathname: "/" });
      renderNavbar();

      const signUpLink = screen.getByRole("link", { name: /sign up/i });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink).toHaveAttribute("href", "/signup");
    });

    it("does not display sign in link when on signin page", () => {
      mockUseLocation.mockReturnValue({ pathname: "/signin" });
      renderNavbar();

      expect(
        screen.queryByRole("link", { name: /sign in/i })
      ).not.toBeInTheDocument();
    });

    it("does not display sign up link when on signup page", () => {
      mockUseLocation.mockReturnValue({ pathname: "/signup" });
      renderNavbar();

      expect(
        screen.queryByRole("link", { name: /sign up/i })
      ).not.toBeInTheDocument();
    });

    it("displays both sign in and sign up links on home page", () => {
      mockUseLocation.mockReturnValue({ pathname: "/" });
      renderNavbar();

      expect(
        screen.getByRole("link", { name: /sign in/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /sign up/i })
      ).toBeInTheDocument();
    });
  });

  it("has proper navigation structure", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    renderNavbar();

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass("fixed", "top-0");
  });

  it("contains the correct SVG icon in brand", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    renderNavbar();

    // Check for the presence of the SVG icon
    const svgIcon = document.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
  });
});
