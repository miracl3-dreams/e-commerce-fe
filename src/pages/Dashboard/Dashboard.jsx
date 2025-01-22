import React, { useEffect, useState } from "react";
import axios from "../../utils/Axios";
import Cards from "../../components/Cards";

const Dashboard = () => {
  const [taskCount, setTaskCount] = useState(0);

  // Function to fetch task count
  const fetchTaskCount = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        params: { per_page: 1 },
      });
      setTaskCount(response.data.meta.total || 0);
    } catch (error) {
      console.error("Failed to fetch task count:", error);
    }
  };

  useEffect(() => {
    fetchTaskCount();
  }, []);

  return (
    <>
      <div className="bg-white h-screen w-full flex-col items-center justify-center">
        <div className="py-4 px-5">
          <h1 className="text-4xl font-bold text-black flex items-center justify-center">
            Dashboard Page
          </h1>
        </div>
        <div className="flex justify-center items-center h-[65vh]">
          <Cards className="bg-blue-500 flex justiy-center items-start h">
            <p className="text-xl text-gray-700 mt-4">
              Total Tasks: <span className="font-semibold">{taskCount}</span>
            </p>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
