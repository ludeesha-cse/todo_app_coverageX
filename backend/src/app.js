const express = require("express");
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', userRoutes);
app.use("/tasks", taskRoutes); // Protected


// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
