const db = require("../utils/db");

const createUser = async ({ name, email, passwordHash }) => {
  const [res] = await db.execute(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, passwordHash]
  );
  return res.insertId;
};

const findByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, name, email FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

module.exports = {
  createUser,
  findByEmail,
  findById,
};
