// import { useEffect } from "react";
// import NavigationBar from "./components/NavigationBar";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import Dashboard from "./pages/Dashboard";
// // import Button from "./components/Button";
// // import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// // import About from "./About";
// // import Contact from "./Contact";

// const AuthRoute = ({ component: Component, ...rest }) => {
//   const token = localStorage.getItem("authToken");

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         token ? <Component {...props} /> : <Navigate to="/login" />
//       }
//     />
//   );
// };

// function App() {
//   useEffect(() => {
//     document.title = "Task Management";
//   }, []);

//   // const createFunction = () => {
//   //   console.log("Created!");
//   // };

//   // const updateFunction = () => {
//   //   console.log("Updated!");
//   // };

//   // const deleteFunction = () => {
//   //   alert("Successfully Deleted!");
//   // };

//   // const viewFunction = () => {
//   //   alert("Successfully Viewed!");
//   // };

//   return (
//     <>
//       {/* <div className="bg-slate-600 h-screen w-full">
//         <NavigationBar />

//         <div className="flex justify-center items-center h-[80vh] gap-1">
//           <Button
//             className={"bg-green-600 text-black border border-black"}
//             onClick={createFunction}
//           >
//             Create
//           </Button>
//           <Button
//             className={"bg-yellow-500 text-orange-500 border border-black"}
//             onClick={updateFunction}
//           >
//             Update
//           </Button>
//           <Button
//             className={"bg-red-500 text-green-500 border border-black"}
//             onClick={deleteFunction}
//           >
//             Delete
//           </Button>
//           <Button
//             className={"bg-yellow-500 text-green-500 border border-black"}
//             onClick={viewFunction}
//           >
//             View
//           </Button>
//         </div>
//       </div> */}

//       <BrowserRouter>
//         {/* <Routes>
//           <Route path="/dashboard" element={<NavigationBar />}>
//             <Route index element={<Dashboard />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//           </Route>
//           <Route path="/login" element={<Login />} />
//           <Route path="/sign-up" element={<SignUp />} />
//         </Routes> */}
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/sign-up" element={<SignUp />} />

//           {/* Protected Dashboard Route */}
//           <Route path="/dashboard" element={<NavigationBar />}>
//             <Route index element={<Dashboard />} />
//             <Route path="about" element={<About />} />
//             <Route path="contact" element={<Contact />} />
//           </Route>

//           {/* Use AuthRoute for protected access */}
//           <AuthRoute path="/dashboard" component={Dashboard} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;

import { useEffect } from "react";
import NavigationBar from "./components/NavigationBar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

// AuthRoute component to protect routes
const AuthRoute = ({ element: Component }) => {
  const token = localStorage.getItem("authToken");

  return token ? <Component /> : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    document.title = "Task Management";
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={<NavigationBar />}>
          <Route index element={<AuthRoute element={Dashboard} />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
