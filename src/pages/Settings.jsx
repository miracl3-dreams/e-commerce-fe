// import React, { useState, useEffect } from "react";

// const Settings = () => {
//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem("darkMode") === "true"
//   );

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//     // localStorage.setItem("darkMode", darkMode);
//   }, [darkMode]);

//   const handleToggleDarkMode = () => {
//     setDarkMode((prevMode) => !prevMode);
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 dark:text-white p-8 rounded-md max-w-3xl mx-auto mt-10 shadow-md">
//       <h1 className="text-2xl font-bold mb-6">Settings</h1>

//       {/* Preferences Section */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Preferences</h2>
//         <div className="flex items-center gap-4">
//           <label className="text-gray-700 dark:text-gray-300">Dark Mode</label>
//           <input
//             type="checkbox"
//             checked={darkMode}
//             onChange={handleToggleDarkMode}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React from "react";

const Settings = () => {
  return <div>Settings</div>;
};

export default Settings;
