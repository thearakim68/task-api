const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary in-memory data
let tasks = [
  {
    id: 1,
    title: "Learn REST APIs",
    completed: false,
  },
  {
    id: 2,
    title: "Test API with Hoppscotch",
    completed: false,
  },
];

let nextId = 3;

// API information
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      getTasks: "GET /api/tasks",
      getTask: "GET /api/tasks/:id",
      createTask: "POST /api/tasks",
      updateTask: "PATCH /api/tasks/:id",
      deleteTask: "DELETE /api/tasks/:id",
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.status(200).json({
    count: tasks.length,
    data: tasks,
  });
});

// Get one task
app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.status(200).json({
    data: task,
  });
});

// Create a task
app.post("/api/tasks", (req, res) => {
  const { title, completed = false } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required and must be a non-empty string",
    });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      error: "Completed must be true or false",
    });
  }

  const newTask = {
    id: nextId,
    title: title.trim(),
    completed,
  };

  nextId += 1;
  tasks.push(newTask);

  res.status(201).json({
    message: "Task created",
    data: newTask,
  });
});

// Update a task
app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Title must be a non-empty string",
      });
    }

    task.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        error: "Completed must be true or false",
      });
    }

    task.completed = completed;
  }

  res.status(200).json({
    message: "Task updated",
    data: task,
  });
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((item) => item.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    message: "Task deleted",
    data: deletedTask,
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

// Handle unexpected errors
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error",
  });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Task API is running on port ${PORT}`);
});