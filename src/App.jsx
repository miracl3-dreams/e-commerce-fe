import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import List from "./pages/List";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AuthRoute from "./routes/AuthRoute"; //

function App() {
  useEffect(() => {
    document.title = "Task Management";
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* Protected Dashboard Route */}
      <Route path="/dashboard" element={<NavigationBar />}>
        <Route index element={<AuthRoute element={Dashboard} />} />
        <Route path="tasks" element={<AuthRoute element={Tasks} />} />
        <Route path="list" element={<AuthRoute element={List} />} />
        <Route path="contact" element={<AuthRoute element={Contact} />} />
      </Route>
    </Routes>
  );
}

export default App;
