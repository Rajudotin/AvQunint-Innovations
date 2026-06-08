const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Create Task
// Get All Tasks
router.route("/").post(protect, createTask).get(protect, getTasks);

// Update Task
// Delete Task
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

// Search/Filter/Pagination is handled in GET / with query params

module.exports = router;
