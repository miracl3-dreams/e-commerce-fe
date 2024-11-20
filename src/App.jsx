import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import List from "./pages/List";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import AuthRoute from "./routes/AuthRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Archive from "./pages/Archive.jsx";
import Test from "./pages/test/Test";

function App() {
  useEffect(() => {
    document.title = "Task Management";
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/test" element={<Test />} />
        <Route
          path="/dashboard"
          element={<AuthRoute element={NavigationBar} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="list" element={<List />} />
          <Route path="contact" element={<Contact />} />
          <Route path="tasks/archive" element={<Archive />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
