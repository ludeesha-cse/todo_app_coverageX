const taskModel = require("../models/taskModel");

const createTask = async (userId, title, description) => {
  return await taskModel.createTask({ userId, title, description });
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
