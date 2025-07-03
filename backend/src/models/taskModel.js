const db = require("../utils/db");

const createTask = async ({ userId, title, description }) => {
  const [res] = await db.execute(
    "INSERT INTO task (user_id, title, description) VALUES (?, ?, ?)",
    [userId, title, description]
  );
  return res.insertId;
};

//get recent 5 incomplete tasks for a user 
const getIncompleteTasks = async (userId) => {
  const [rows] = await db.execute(
    "SELECT id, title, description, completed, created_at FROM task WHERE user_id = ? AND completed = FALSE ORDER BY created_at DESC LIMIT 5",
    [userId]
  );
  return rows;
};

const markAsDone = async (taskId, userId) => {
  const [res] = await db.execute(
    "UPDATE task SET completed = TRUE WHERE id = ? AND user_id = ?",
    [taskId, userId]
  );
  return res.affectedRows > 0;
};

module.exports = {
  createTask,
  getIncompleteTasks,
  markAsDone,
};
