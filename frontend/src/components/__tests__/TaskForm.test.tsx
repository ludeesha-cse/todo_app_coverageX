import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "../TaskForm";

describe("TaskForm", () => {
  const mockOnAddTask = vi.fn();

  beforeEach(() => {
    mockOnAddTask.mockClear();
  });

  it("renders form fields correctly", () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);

    expect(screen.getByText(/task title/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  it("has correct placeholder texts", () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);

    expect(
      screen.getByPlaceholderText(/enter a descriptive title/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/add more details/i)
    ).toBeInTheDocument();
  });

  it("updates input values when typing", async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);

    const titleInput = screen.getByPlaceholderText(
      /enter a descriptive title/i
    );
    const descriptionInput = screen.getByPlaceholderText(/add more details/i);

    await user.type(titleInput, "New Task");
    await user.type(descriptionInput, "Task description");

    expect(titleInput).toHaveValue("New Task");
    expect(descriptionInput).toHaveValue("Task description");
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    mockOnAddTask.mockResolvedValue(undefined);

    render(<TaskForm onAddTask={mockOnAddTask} />);

    const titleInput = screen.getByPlaceholderText(
      /enter a descriptive title/i
    );
    const descriptionInput = screen.getByPlaceholderText(/add more details/i);
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "New Task");
    await user.type(descriptionInput, "Task description");
    await user.click(submitButton);

    expect(mockOnAddTask).toHaveBeenCalledWith("New Task", "Task description");
  });

  it("clears form after successful submission", async () => {
    const user = userEvent.setup();
    mockOnAddTask.mockResolvedValue(undefined);

    render(<TaskForm onAddTask={mockOnAddTask} />);

    const titleInput = screen.getByPlaceholderText(
      /enter a descriptive title/i
    );
    const descriptionInput = screen.getByPlaceholderText(/add more details/i);
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "New Task");
    await user.type(descriptionInput, "Task description");
    await user.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
      expect(descriptionInput).toHaveValue("");
    });
  });

  it("disables submit button when form is empty", () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);

    const submitButton = screen.getByRole("button", { name: /add task/i });
    expect(submitButton).toBeDisabled();
  });

  it("disables submit button when only title is provided", async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);

    const titleInput = screen.getByPlaceholderText(
      /enter a descriptive title/i
    );
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "New Task");

    expect(submitButton).toBeDisabled();
  });

  it("disables submit button when only description is provided", async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);

    const descriptionInput = screen.getByPlaceholderText(/add more details/i);
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(descriptionInput, "Task description");

    expect(submitButton).toBeDisabled();
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    let resolvePromise: (value?: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockOnAddTask.mockReturnValue(promise);

    render(<TaskForm onAddTask={mockOnAddTask} />);

    const titleInput = screen.getByPlaceholderText(
      /enter a descriptive title/i
    );
    const descriptionInput = screen.getByPlaceholderText(/add more details/i);
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "New Task");
    await user.type(descriptionInput, "Task description");
    await user.click(submitButton);

    expect(screen.getByText(/creating task/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    resolvePromise!();
    await waitFor(() => {
      expect(screen.getByText(/add task/i)).toBeInTheDocument();
    });
  });

  it("prevents submission with whitespace-only input", async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);

    const titleInput = screen.getByPlaceholderText(
      /enter a descriptive title/i
    );
    const descriptionInput = screen.getByPlaceholderText(/add more details/i);
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "   ");
    await user.type(descriptionInput, "   ");

    expect(submitButton).toBeDisabled();
  });

  it("handles submission errors gracefully", async () => {
    const user = userEvent.setup();
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockOnAddTask.mockRejectedValue(new Error("Failed to add task"));

    render(<TaskForm onAddTask={mockOnAddTask} />);

    const titleInput = screen.getByPlaceholderText(
      /enter a descriptive title/i
    );
    const descriptionInput = screen.getByPlaceholderText(/add more details/i);
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "New Task");
    await user.type(descriptionInput, "Task description");
    await user.click(submitButton);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to add task:",
        expect.any(Error)
      );
    });

    // Form should not be cleared on error
    expect(titleInput).toHaveValue("New Task");
    expect(descriptionInput).toHaveValue("Task description");

    consoleError.mockRestore();
  });
});
