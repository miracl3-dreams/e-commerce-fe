import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cards from "../components/Cards";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    task: "",
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setTasks(response.data.data);
      } else {
        setTasks([]);
        setMessage("No tasks found.");
      }
    } catch (error) {
      setMessage("Error fetching tasks.");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value === "true",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCreateOrUpdateTask = async () => {
    try {
      const taskPayload = {
        ...formData,
        status: currentTask ? formData.status : false,
      };

      if (currentTask) {
        await axios.put(
          `http://127.0.0.1:8000/api/v1/tasks/${currentTask.id}`,
          taskPayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        // setMessage("Task updated successfully!");
        toast.success("Successfully Updated!", {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/v1/tasks", taskPayload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        // setMessage("Task created successfully!");
        toast.success("Successfully Created!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }

      setFormData({ name: "", task: "" });
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      setMessage("Error saving task.");
      console.error("Error saving task:", error);
    }
  };

  const openModalForUpdate = (task) => {
    setCurrentTask(task);
    setFormData({ name: task.name, status: task.status, task: task.task });
    setIsModalOpen(true);
  };

  const openModalForCreate = () => {
    setCurrentTask(null);
    setFormData({ name: "", task: "" });
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setMessage("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      setMessage("Error deleting task.");
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesNameOrTask =
      task.name.toLowerCase().includes(lowerCaseQuery) ||
      task.task.toLowerCase().includes(lowerCaseQuery);
    const matchesStatus =
      (searchQuery.includes("completed:") && task.status) ||
      (searchQuery.includes("incomplete:") && !task.status) ||
      (!searchQuery.includes("completed:") &&
        !searchQuery.includes("incomplete:"));

    return matchesNameOrTask && matchesStatus;
  });

  return (
    <div className="bg-slate-700 relative flex flex-col items-center p-6 h-screen w-full">
      <h1 className="font-poppins font-bold text-3xl text-white py-8">Tasks</h1>

      <div className="flex flex-col items-center gap-5 w-full">
        <div className="bg-slate-300 absolute flex flex-col items-start gap-6 p-8 w-full max-w-5xl border-2 border-black rounded-md font-poppins">
          <div className="flex justify-between w-full">
            <Button
              className="bg-green-500 px-4 py-2 rounded-md"
              onClick={openModalForCreate}
            >
              Create
            </Button>
            <input
              className="px-4 py-2 rounded-md"
              type="text"
              placeholder="Search task name or what task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Modal isOpen={isModalOpen} className="bg-slate-300">
            <div className="flex justify-between items-center">
              <h1 className="font-poppins">
                {currentTask ? "Update Task" : "Add Task"}
              </h1>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setMessage("");
                }}
              >
                <IoMdClose />
              </button>
            </div>
            <div className="flex flex-col items-start gap-2 pt-5">
              <input
                className="pl-1 py-1 text-sm rounded-md"
                name="name"
                placeholder="Full name..."
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                className="pl-1 py-1 text-sm rounded-md"
                name="task"
                placeholder="Task..."
                value={formData.task}
                onChange={handleInputChange}
              />

              {currentTask && (
                <div className="flex flex-col gap-2">
                  <span>Status:</span>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="true"
                      checked={formData.status === true}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2">Completed</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="false"
                      checked={formData.status === false}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2">Incomplete</span>
                  </label>
                </div>
              )}
              <Button
                className="bg-green-500 w-full px-4 py-2 rounded-md"
                onClick={handleCreateOrUpdateTask}
              >
                {currentTask ? "Update" : "Create"}
              </Button>
            </div>
          </Modal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1280px] mx-auto">
            {filteredTasks.map((task) => (
              <Cards key={task.id}>
                <h1 className="text-lg font-semibold">Name: {task.name}</h1>
                <h1 className="text-lg font-semibold">Task: {task.task}</h1>
                <h1 className="text-lg font-semibold">Status: {task.status}</h1>

                <div className="flex gap-3 mt-4">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => openModalForUpdate(task)}
                  >
                    Update
                  </Button>
                  <Button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Cards>
            ))}
          </div>
        </div>
      </div>

      {loading && <h2 className="text-white">Loading...</h2>}
      {message && <h2 className="text-white">{message}</h2>}
    </div>
  );
};

export default Tasks;
