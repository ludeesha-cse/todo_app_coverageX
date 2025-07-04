const taskModel = require("../models/taskModel");

const createTask = async (userId, title, description) => {
  const taskId = await taskModel.createTask({ userId, title, description });
  // Get the complete task object to return
  const tasks = await taskModel.getTaskById(taskId, userId);
  return tasks[0]; // Return the first (and only) task
};

const getRecentIncompleteTasks = async (userId) => {
  return await taskModel.getIncompleteTasks(userId);
};

const markTaskAsDone = async (userId, taskId) => {
  const updated = await taskModel.markAsDone(taskId, userId);
  if (!updated) throw new Error("Task not found or not owned by user");
  return true;
};

module.exports = {
  createTask,
  getRecentIncompleteTasks,
  markTaskAsDone,
};
