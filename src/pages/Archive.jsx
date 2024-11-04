import React, { useEffect, useState } from "react";
import axios from "axios";

const Archive = () => {
  const [trashedTasks, setTrashedTasks] = useState([]);

  useEffect(() => {
    const fetchTrashedTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8000/api/v1/task/trashed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched trashed tasks:", response.data);
        setTrashedTasks(
          Array.isArray(response.data.data.data) ? response.data.data.data : []
        );
      } catch (error) {
        console.error("Error fetching trashed tasks:", error);
      }
    };

    fetchTrashedTasks();
  }, []);

  return (
    <div>
      <h1 className="flex justify-center items-center">Archived Tasks</h1>
      {trashedTasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Task ID</th>
                <th className="border border-gray-300 px-4 py-2">Task Title</th>
                <th className="border border-gray-300 px-4 py-2">
                  Task Description
                </th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
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
    </div>
  );
};

export default Archive;
