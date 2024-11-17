import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tasksPerPage] = useState(3);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [status] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks(currentPage);
    }
  }, [navigate, currentPage]);

  const fetchTasks = async (page = 1, searchQuery = "", status = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        params: {
          page,
          per_page: tasksPerPage,
          query: searchQuery,
          status: status,
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setTasks(response.data.data);
        setCurrentPage(response.data.meta.current_page);
        setTotalPages(response.data.meta.last_page);
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

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchTasks(1, searchQuery);
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/tasks-search`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          params: {
            query: searchQuery,
            status: status.toLowerCase(),
            page: currentPage,
          },
        }
      );

      if (response.data && Array.isArray(response.data.data)) {
        // console.log(response.meta);
        setTasks(response.data.data);
        setCurrentPage(response.data.meta.current_page);
        setTotalPages(response.data.meta.last_page);
      } else {
        setTasks([]);
        setMessage("No tasks found.");
      }
    } catch (error) {
      console.error("Error searching tasks:", error);
      setMessage("No Task Found.");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
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
        toast.success("Successfully Created!", {
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
      }

      setFormData({ name: "", task: "" });
      setIsModalOpen(false);
      fetchTasks(currentPage, searchQuery);
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

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/tasks/${taskToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setMessage("Task deleted successfully!");
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
      fetchTasks(currentPage, searchQuery);
      toast.success("Task deleted successfully!", {
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
    } catch (error) {
      setMessage("Error deleting task.");
      console.error("Error deleting task:", error);
    }
  };

  const openDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-white relative flex flex-col items-center h-full w-full">
      <h1 className="font-poppins font-bold text-3xl text-black py-8">Tasks</h1>

      <div className="flex flex-col items-center gap-5 w-full">
        <div className="bg-[#D72323] absolute flex flex-col items-start gap-6 p-8 w-full max-w-5xl rounded-md font-poppins">
          {/* // Controls for Creating and Searching Tasks // */}
          <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between w-full">
            <div className="flex items-center gap-x-2">
              <Button
                className="bg-green-500 px-4 py-2 rounded-md"
                onClick={openModalForCreate}
              >
                Create
              </Button>
              <Button className="bg-yellow-500 px-4 py-2 rounded-md">
                <Link to={"archive"}>Archive</Link>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="px-4 py-2 rounded-md"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Display Message if No Tasks Found */}
          {tasks.length === 0 && !loading && (
            <p className="self-center text-center text-5xl text-red-500 font-semibold">
              {message || "No tasks found."}
            </p>
          )}

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
            <div className="flex flex-col items-start gap-2 pt-5 w-[360px]">
              <input
                className="pl-1 py-1 text-sm rounded-md w-full"
                name="name"
                placeholder="Task Title..."
                value={formData.name}
                onChange={handleInputChange}
              />
              <textarea
                className="pl-1 py-1 text-sm rounded-md w-full"
                name="task"
                placeholder="Task Description..."
                value={formData.task}
                onChange={handleInputChange}
                rows={5}
                cols={5}
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
          <Modal isOpen={isDeleteModalOpen} className="bg-slate-300">
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">
                Do you want to delete this task?
              </h2>
              <div className="flex gap-3">
                <Button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={handleDeleteTask}
                >
                  Yes, Delete
                </Button>
                <Button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1280px] mx-auto">
            {tasks.map((task) => (
              <Cards className={"bg-white"} key={task.id}>
                <h1 className="text-lg font-semibold">
                  Task Title: {task.name}
                </h1>
                <h1 className="text-lg font-semibold">
                  Task Description: {task.task}
                </h1>
                <h1 className="text-lg font-semibold">Status: {task.status}</h1>

                <div className="flex gap-3 mt-4 justify-center">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => openModalForUpdate(task)}
                  >
                    Update
                  </Button>
                  <Button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => openDeleteModal(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Cards>
            ))}
          </div>
          {tasks.length > 0 && totalPages > 1 && !loading && (
            <div className="flex flex-col self-center lg:items-end mt-4">
              <div className="flex gap-2 mt-6">
                {/* Previous Button */}
                <Button
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === pageNumber
                          ? "bg-black text-white"
                          : "bg-green-500 text-black"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                {/* Next Button */}
                <Button
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && <h2 className="text-white">Loading...</h2>}
      {message && <h2 className="text-white">{message}</h2>}
    </div>
  );
};

export default Tasks;
