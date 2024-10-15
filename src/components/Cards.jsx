import React from "react";

const Cards = ({ tasks }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">{task.name}</h2>
          <p className="text-gray-700 mb-4">{task.task}</p>
          <div className="flex justify-between items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.is_completed
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {task.is_completed ? "Completed" : "Incomplete"}
            </span>
            <div className="space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Edit
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
