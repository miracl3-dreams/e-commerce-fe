import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Archive = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [trashedTasks, setTrashedTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [status] = useState("");
  const trashedTasksPerPage = 5;
  const navigate = useNavigate();

  const fetchTrashedTasks = async (page = 1, searchQuery = "", status = "") => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("You must be logged in to view your trashed tasks.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/v1/task/trashed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: page,
            per_page: trashedTasksPerPage,
            query: searchQuery,
            status: status,
          },
        }
      );

      const tasks = response.data.data.data || [];
      setTrashedTasks(tasks);
      setCurrentPage(response.data.meta?.current_page || 1);
      setTotalPages(response.data.meta?.last_page || 1);

      if (tasks.length === 0) {
        setMessage("No Task Found");
      }
    } catch (error) {
      console.error("Error fetching trashed tasks:", error);
      setMessage("No Tasks Found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedTasks(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchTrashedTasks(1, searchQuery);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:8000/api/v1/trashed-search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            query: searchQuery,
            status: status.toLowerCase(),
            page: currentPage,
          },
        }
      );

      const data = response.data;
      setTrashedTasks(Array.isArray(data.data.data) ? data.data.data : []);
      setTotalPages(data.data.last_page);
      setCurrentPage(data.data.current_page);

      if (!Array.isArray(data.data.data) || data.data.data.length === 0) {
        setMessage("No Task Found");
      } else {
        setMessage("");
      }
    } catch (error) {
      console.error("Error searching tasks:", error);
      setMessage("No Task Found");
    }
  };

  const restoreTask = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        `http://localhost:8000/api/v1/tasks/${taskId}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (
        response.status === 200 &&
        response.data?.message === "Task restored successfully!"
      ) {
        setTrashedTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );
        toast.success("Task restored successfully!", {
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
        alert("Failed to restore task. Please try again.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to restore task.");
      console.error("Error restoring task:", error);
    }
  };

  const forceDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `http://localhost:8000/api/v1/tasks/${taskId}/force-delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (
        response.status === 200 &&
        response.data?.message === "Task permanently deleted successfully!"
      ) {
        setTrashedTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );
        toast.success("Task permanently deleted!", {
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
        alert("Failed to delete task permanently. Please try again.");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete task permanently."
      );
      console.error("Error deleting task permanently:", error);
    }
  };

  const restoreSelectedTasks = async () => {
    for (const taskId of selectedTasks) {
      await restoreTask(taskId);
    }
    setSelectedTasks([]);
  };

  const forceDeleteSelectedTasks = async () => {
    for (const taskId of selectedTasks) {
      await forceDeleteTask(taskId);
    }
    setSelectedTasks([]);
  };

  const handleCheckboxChange = (taskId) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white relative flex flex-col items-center p-6 h-screen w-full">
      <h1 className="flex justify-center items-center font-bold text-3xl text-black py-8">
        Archived Tasks
      </h1>

      {/* Only show buttons if at least one task is selected */}
      <div className="flex justify-center items-center mb-4 w-full">
        {selectedTasks.length > 0 && (
          <>
            <button
              onClick={restoreSelectedTasks}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              disabled={selectedTasks.length === 0}
            >
              Restore Selected
            </button>
            <button
              onClick={forceDeleteSelectedTasks}
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-4"
              disabled={selectedTasks.length === 0}
            >
              Delete Selected
            </button>
          </>
        )}
        {/* Search bar */}
        {/* // I will make this reusable soon //\ */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="border border-gray-300 rounded-md px-4 py-2 mr-2"
        />
        <Button
          onClick={handleSearch}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Search
        </Button>
      </div>

      {/* Task list */}
      {trashedTasks.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#D72323]">
                  <th className="border border-gray-300 px-4 py-2">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks(trashedTasks.map((task) => task.id));
                        } else {
                          setSelectedTasks([]);
                        }
                      }}
                    />
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Task ID</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Task Title
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Task Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trashedTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center border border-gray-300 px-4 py-2"
                    >
                      No Task Found
                    </td>
                  </tr>
                ) : (
                  trashedTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => handleCheckboxChange(task.id)}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {task.id}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {task.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {task.task}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {task.status}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Button
                          onClick={() => restoreTask(task.id)}
                          className="bg-blue-500 text-white text-xs md:text-md lg:text-lg px-4 py-2 rounded-md mr-2"
                        >
                          Restore
                        </Button>
                        <Button
                          onClick={() => forceDeleteTask(task.id)}
                          className="bg-red-500 text-white text-xs md:text-md lg:text-lg px-4 py-2 rounded-md"
                        >
                          Delete (Force)
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 mx-2 bg-black rounded-md text-white"
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <Button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 mx-2 rounded-md ${
                    currentPage === pageNumber
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-black"
                  }`}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 mx-2 bg-black rounded-md text-white"
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        !loading &&
        !message && (
          <h1 className="text-5xl text-center text-gray-500 mt-4">
            No archived tasks found
          </h1>
        )
      )}
    </div>
  );
};

export default Archive;
