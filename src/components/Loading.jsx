import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin h-5 w-5 mr-3 text-blue-700"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <circle
          className="opacity-100"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-100"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4zm2 5.292V12H12l2 3.292a8.001 8.001 0 01-6-6z"
        ></path>
      </svg>
      <span>Logging in...</span>
    </div>
  );
};

export default Loading;
