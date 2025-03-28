// src/controllers/taskController.js
const Task = require("../models/taskModel");

exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({
      title,
      description,
      user: req.user._id, // from auth middleware
    });
    
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    // Optional filters: completed, date range, etc.
    const { completed } = req.query;
    let query = { user: req.user._id };
    
    if (completed !== undefined) {
      query.completed = completed === "true";
    }
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json({ task });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, completed },
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }
    
    res.json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
};
