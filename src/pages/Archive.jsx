import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

const Archive = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trashedTasks, setTrashedTasks] = useState([]);
  const trashedTasksPerPage = 5;

  useEffect(() => {
    const fetchTrashedTasks = async (page = 1) => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:8000/api/v1/task/trashed?page=${page}&per_page=${trashedTasksPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        setTrashedTasks(Array.isArray(data.data.data) ? data.data.data : []);
        setTotalPages(data.data.last_page);
        setCurrentPage(data.data.current_page);
      } catch (error) {
        console.error("Error fetching trashed tasks:", error);
      }
    };

    fetchTrashedTasks(currentPage);
  }, [currentPage]);

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
        alert("Failed to restore task. Please try again.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to restore task.");
      console.error("Error restoring task:", error);
    }
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
      {trashedTasks.length > 0 ? (
        <div className="overflow-x-auto rounded-md">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#D72323]">
                <th className="border border-gray-300 px-4 py-2">Task ID</th>
                <th className="border border-gray-300 px-4 py-2">Task Title</th>
                <th className="border border-gray-300 px-4 py-2">
                  Task Description
                </th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trashedTasks.map((task) => (
                <tr key={task.id}>
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
                    <button
                      onClick={() => restoreTask(task.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1 className="flex justify-center items-center">
          No trashed tasks found.
        </h1>
      )}

      <div className="z-auto flex self-center mt-4">
        <button
          className="bg-black text-white px-4 py-2 rounded-md mx-1"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-black text-white px-4 py-2 rounded-md mx-1"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Archive;
