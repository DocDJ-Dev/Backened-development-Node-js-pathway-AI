const { realpathSync } = require("fs");
const fs = require("fs/promises");
const { get } = require("http");
const path = require("path");

const filePath = path.join(__dirname, "tasks.json");

async function getAllTasks() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const tasks = JSON.parse(data);
    return tasks;
  } catch (err) {
    if (err.code === "ENOENT") {
      return { tasks: [], nextId: 1 };
    }
    console.log("Something went wrong", err.message);
  }
}

async function addTask(title) {
  try {
    const tasks = await getAllTasks();
    const newTask = { id: tasks.nextId, title, completed: false };
    tasks.nextId++;
    tasks.tasks.push(newTask);

    await fs.writeFile(filePath, JSON.stringify(tasks, 2, null), "utf-8");

    return newTask;
  } catch (err) {
    console.log("Something went wrong", err.message);
  }
}

async function completeTask(id) {
  try {
    const tasks = await getAllTasks();

    const task = tasks.tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error("TASK NOT FOUND");
    }

    if (task.completed === false) {
      task.completed = true;
    } else {
      task.completed = false;
    }
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
    return task;
  } catch (err) {
    console.log("Failed:", err.message);
  }
}
// completeTask(99);

async function deleteTask(id) {
  try {
    const tasks = await getAllTasks();

    const task = tasks.tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error("TASK NOT FOUND");
    }

    newTasks = tasks.tasks.filter((t) => t.id !== id);

    await fs.writeFile(filePath, JSON.stringify(newTasks, null, 2));

    return task;
  } catch (err) {
    console.log("Failed:", err.message);
  }
}
