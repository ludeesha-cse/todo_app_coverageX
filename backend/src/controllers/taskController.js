const taskService = require("../services/taskService");

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await taskService.createTask(req.userId, title, description);
    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getRecentIncompleteTasks(req.userId);
    res.json(tasks);
  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const markAsDone = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId))
      return res.status(400).json({ message: "Invalid task ID" });

    await taskService.markTaskAsDone(req.userId, taskId);
    res.json({ message: "Task marked as completed" });
  } catch (err) {
    console.error("Mark Done Error:", err);
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  markAsDone,
};
