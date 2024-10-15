import React, { useEffect, useState } from "react";
import axios from "axios";
import Cards from "../components/Cards";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [newTask, setNewTask] = useState({ name: "", task: "" }); // State for new task creation
  const [editingTaskId, setEditingTaskId] = useState(null); // Track the task being edited

  const token = localStorage.getItem("authToken");

  // Fetch all tasks (index)
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params: { per_page: 10 },
      });
      setTasks(response.data.data);
      setError("");
    } catch (err) {
      setTasks([]);
      setError(err.response?.data?.message || "Failed to fetch tasks.");
    }
  };

  // Create a new task (store)
  const createTask = async (taskData) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/tasks",
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks(); // Refresh tasks after creation
      setNewTask({ name: "", task: "" }); // Reset form
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task.");
    }
  };

  // Update an existing task (update)
  const updateTask = async (taskId, taskData) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/v1/tasks/${taskId}`,
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks(); // Refresh tasks after update
      setEditingTaskId(null); // Reset editing state
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task.");
    }
  };

  // Show a specific task (show)
  const showTask = async (taskId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Return the task data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch task.");
    }
  };

  // Search for tasks (search)
  const searchTasks = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/tasks-search",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { query, status },
        }
      );
      setTasks(response.data.data);
      setError("");
    } catch (err) {
      setTasks([]);
      setError(err.response?.data?.message || "Failed to fetch tasks.");
    }
  };

  // Restore a trashed task (restore)
  const restoreTask = async (taskId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/tasks/${taskId}/restore`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks(); // Refresh tasks after restoring
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to restore task.");
    }
  };

  // Fetch trashed tasks (trashed)
  const fetchTrashedTasks = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/tasks/trashed",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { per_page: 10 },
        }
      );
      setTasks(response.data.data);
      setError("");
    } catch (err) {
      setTasks([]);
      setError(err.response?.data?.message || "Failed to fetch trashed tasks.");
    }
  };

  // Delete a task (destroy)
  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/v1/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks(); // Refresh tasks after deletion
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task.");
    }
  };

  // useEffect to fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editingTaskId) {
            updateTask(editingTaskId, newTask);
          } else {
            createTask(newTask);
          }
        }}
        className="mb-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <textarea
          placeholder="Task Description"
          value={newTask.task}
          onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {editingTaskId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="ml-2 px-4 py-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <button
          onClick={searchTasks}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      <Cards tasks={tasks} />

      <button
        onClick={fetchTrashedTasks}
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
      >
        Show Trashed Tasks
      </button>
    </div>
  );
};

export default Dashboard;
