// Mock data for tests
export const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
};

export const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  completed: false,
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
};

export const mockTasks = [
  mockTask,
  {
    id: 2,
    title: "Second Task",
    description: "Second Description",
    completed: true,
    created_at: "2025-01-02T00:00:00.000Z",
    updated_at: "2025-01-02T00:00:00.000Z",
  },
];

export const mockAuthContextValue = {
  user: mockUser,
  isLoading: false,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => {},
  isAuthenticated: true,
};

export const mockUnauthenticatedContextValue = {
  user: null,
  isLoading: false,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => {},
  isAuthenticated: false,
};
