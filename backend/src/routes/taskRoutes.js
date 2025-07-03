const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware); 

router.post("/", taskController.createTask);
router.get("/", taskController.getTasks);
router.patch("/:id/done", taskController.markAsDone);

module.exports = router;