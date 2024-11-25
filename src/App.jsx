import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tasks from "./pages/Tasks/Tasks";
import List from "./pages/List/List";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Signup/Signup";
import Settings from "./pages/Settings/Settings";
import AuthRoute from "./routes/AuthRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Archive from "./pages/Archive/Archive.jsx";
import Test from "./pages/test/Test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </>
  );
}

export default App;
