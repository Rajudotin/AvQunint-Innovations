const Task = require("../models/Task");

const VALID_STATUSES = ["Pending", "Completed"];

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,

      userId: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { q, status } = req.query;
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);

    const filter = { userId: req.user._id };

    if (q && typeof q === "string") {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (status && typeof status === "string") {
      if (VALID_STATUSES.includes(status)) {
        filter.status = status;
      }
    }

    const totalCount = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

    res.status(200).json({
      tasks,
      page,
      limit,
      totalCount,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { title, description, status } = req.body;

    if (typeof title === "string") {
      const trimmed = title.trim();
      if (!trimmed) {
        return res.status(400).json({ message: "Title is required" });
      }
      task.title = trimmed;
    }

    if (typeof description === "string") {
      task.description = description;
    }

    if (typeof status === "string") {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`,
        });
      }
      task.status = status;
    }

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
