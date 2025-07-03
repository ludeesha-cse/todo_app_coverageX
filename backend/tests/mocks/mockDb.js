// Mock database for testing
const mockDb = {
  users: [],
  tasks: [],
  nextUserId: 1,
  nextTaskId: 1,

  // Mock execute method
  execute: jest.fn(),

  // Reset mock data
  reset: () => {
    mockDb.users = [];
    mockDb.tasks = [];
    mockDb.nextUserId = 1;
    mockDb.nextTaskId = 1;
    mockDb.execute.mockClear();
  },

  // Helper methods for setting up test data
  addUser: (user) => {
    const userWithId = { id: mockDb.nextUserId++, ...user };
    mockDb.users.push(userWithId);
    return userWithId;
  },

  addTask: (task) => {
    const taskWithId = { id: mockDb.nextTaskId++, ...task };
    mockDb.tasks.push(taskWithId);
    return taskWithId;
  },
};

module.exports = mockDb;
