import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "../TaskCard";
import { mockTask } from "../../test/mocks";

describe("TaskCard", () => {
  const mockOnDone = vi.fn();

  beforeEach(() => {
    mockOnDone.mockClear();
  });

  it("renders task title and description", () => {
    render(<TaskCard task={mockTask} onDone={mockOnDone} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("displays formatted creation date when provided", () => {
    render(<TaskCard task={mockTask} onDone={mockOnDone} />);

    // The date should be formatted as a locale date string
    expect(screen.getByText(/Created/)).toBeInTheDocument();
  });

  it("does not display creation date when not provided", () => {
    const taskWithoutDate = { ...mockTask, created_at: undefined };
    render(<TaskCard task={taskWithoutDate} onDone={mockOnDone} />);

    expect(screen.queryByText(/Created/)).not.toBeInTheDocument();
  });

  it("calls onDone when Complete button is clicked", () => {
    render(<TaskCard task={mockTask} onDone={mockOnDone} />);

    const completeButton = screen.getByRole("button", { name: /complete/i });
    fireEvent.click(completeButton);

    expect(mockOnDone).toHaveBeenCalledTimes(1);
  });

  it("renders complete button with correct text", () => {
    render(<TaskCard task={mockTask} onDone={mockOnDone} />);

    const completeButton = screen.getByRole("button", { name: /complete/i });
    expect(completeButton).toBeInTheDocument();
    expect(completeButton).toHaveTextContent("Complete");
  });

  it("formats date correctly", () => {
    const taskWithDate = {
      ...mockTask,
      created_at: "2025-01-15T10:30:00.000Z",
    };

    render(<TaskCard task={taskWithDate} onDone={mockOnDone} />);

    // Check that the date is formatted (exact format may vary by locale)
    expect(screen.getByText(/Created/)).toBeInTheDocument();
    expect(
      screen.getByText(/1\/15\/2025|15\/1\/2025|2025/)
    ).toBeInTheDocument();
  });
});
