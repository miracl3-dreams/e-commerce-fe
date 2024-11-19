import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

const Archive = () => {
  const [trashedTasks, setTrashedTasks] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [trashedTasksPerPage] = useState(5);
  const [status] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchTrashedTasks(currentPage, searchQuery, status);
    }
  }, [navigate, currentPage, status]);

  const fetchTrashedTasks = async (page = 1, searchQuery = "", status = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/task/trashed`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          params: {
            page,
            per_page: trashedTasksPerPage,
            query: searchQuery,
            status: status,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.data) {
        setTrashedTasks({
          data: response.data.data.data,
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
        });
        setMessage("");
      } else {
        setTrashedTasks({
          data: [],
          current_page: 1,
          last_page: 1,
        });
        setMessage("No tasks found.");
      }
    } catch (error) {
      setMessage("No tasks found.");
      console.error("Error fetching trashed tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setCurrentPage(1);
      fetchTrashedTasks(1, searchQuery);
      setMessage("No search found.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/trashed-search`,
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

      const data = response.data?.data || {};
      const trashedTasks = Array.isArray(data.data) ? data.data : [];

      setTrashedTasks({
        data: trashedTasks,
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
      });

      if (trashedTasks.length === 0) {
        setMessage("No search found.");
        // setLoading(true);
      } else {
        setMessage("");
      }
    } catch (error) {
      setMessage("Error fetching trashed tasks: Please try again.");
      console.error("Error fetching trashed tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const restoreSelectedTasks = async () => {
    for (const taskId of selectedTasks) {
      await handleRestoreTask(taskId);
    }
    setSelectedTasks([]);
  };

  const forceDeleteSelectedTasks = async () => {
    for (const taskId of selectedTasks) {
      await handleForceDeleteTask(taskId);
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

  // const handlePageClick = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  //   fetchTrashedTasks(pageNumber);
  // };

  const renderPagination = () => {
    if (trashedTasks.last_page <= 1) return null;

    const pages = [];
    for (let i = 1; i <= trashedTasks.last_page; i++) {
      pages.push(
        <Button
          key={i}
          className={`px-3 py-1 rounded-md ${
            i === trashedTasks.current_page
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => fetchTrashedTasks(i)}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  const handleRestoreTask = async (taskId) => {
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
        setTrashedTasks((prevTasks) => ({
          ...prevTasks,
          data: prevTasks.data.filter((task) => task.id !== taskId),
        }));
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

  const handleForceDeleteTask = async (taskId) => {
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
        setTrashedTasks((prevTasks) => ({
          ...prevTasks,
          data: prevTasks.data.filter((task) => task.id !== taskId),
        }));
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

  return (
    <div className="bg-white relative flex flex-col items-center h-full w-full">
      <h1 className="font-poppins font-bold text-3xl text-black py-8">
        Archived Tasks
      </h1>

      <div className="flex flex-col items-center gap-5 w-full">
        <div className="bg-[#D72323] absolute flex flex-col items-start gap-6 p-8 w-full max-w-5xl rounded-md font-poppins">
          <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between w-full">
            <div className="flex items-center gap-x-2">
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
            </div>
            <div className="flex items-center gap-2">
              <input
                className="px-4 py-2 rounded-md"
                type="text"
                placeholder="Search trashed tasks..."
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

          {/* Tasks Table */}
          <div className="overflow-x-auto w-full mt-4 rounded-md">
            <table className="min-w-full table-auto bg-white">
              <thead className="w-full">
                <tr className="bg-gray-200">
                  <td className="text-center px-4 py-2">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks(
                            trashedTasks.data.map((task) => task.id)
                          );
                        } else {
                          setSelectedTasks([]);
                        }
                      }}
                    />
                  </td>
                  <th className="text-center px-4 py-2">Task Title</th>
                  <th className="text-center px-4 py-2">Task Description</th>
                  <th className="text-center px-4 py-2 ">Status</th>
                  <th className="text-center px-4 py-2 ">Action</th>
                </tr>
              </thead>
              <tbody>
                {trashedTasks.data ? (
                  trashedTasks.data.length > 0 ? (
                    trashedTasks.data.map((task) => (
                      <tr key={task.id}>
                        <td className="flex justify-center px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => handleCheckboxChange(task.id)}
                          />
                        </td>
                        <td className="text-center px-4 py-2">{task.name}</td>
                        <td className="text-center px-4 py-2">{task.task}</td>
                        <td className="text-center px-4 py-2">{task.status}</td>
                        <td className="text-center px-4 py-2 flex justify-center gap-4">
                          <div className="flex gap-2">
                            <Button
                              className="bg-blue-500 text-white px-4 py-2 rounded-md"
                              onClick={() => handleRestoreTask(task.id)}
                            >
                              Restore
                            </Button>
                            <Button
                              className="bg-red-500 text-white px-4 py-2 rounded-md"
                              onClick={() => handleForceDeleteTask(task.id)}
                            >
                              Delete (Force)
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center text-[#BBBBBB] text-xl px-4 py-2"
                      >
                        {message || "No Tasks Found!"}
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-[#BBBBBB] text-xl px-4 py-2"
                    >
                      {message || "No Tasks Found!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center w-full gap-3 mt-5">
            {/* Previous Button */}
            <Button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                const prevPage = Math.max(trashedTasks.current_page - 1, 1);
                fetchTrashedTasks(prevPage);
              }}
              disabled={trashedTasks.current_page === 1}
            >
              Previous
            </Button>

            {/* Page Buttons */}
            <div className="flex items-center gap-1">{renderPagination()}</div>

            {/* Next Button */}
            <Button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                const nextPage = Math.min(
                  trashedTasks.current_page + 1,
                  trashedTasks.last_page
                );
                fetchTrashedTasks(nextPage);
              }}
              disabled={trashedTasks.current_page === trashedTasks.last_page}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archive;
