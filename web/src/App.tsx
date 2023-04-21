import Home from './components/Home/Home'
import Navbar from "./components/Navbar/Navbar"
import Register from "./components/Register/Register"
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import { useEffect, useState } from "react";
import userContext from "./context/userContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import ProtectedRoute, { ProtectedRouteProps } from "./utils/PrivateRoute";
import Requisition from "./components/Requisition/Requisition";

function App() {
  const [user, setUser] = useState<any>({});

  const handleStorage = () => {
    const userLocalStorage = localStorage.getItem("user");

    if (userLocalStorage && userLocalStorage !== "{}") {
      setUser(JSON.parse(userLocalStorage!));
      localStorage.setItem("user", userLocalStorage);
    }
  }

  useEffect(() => {
    handleStorage();
  }, []);

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    authenticationPath: '/',
  };

  return (
    <BrowserRouter>
      <userContext.Provider value={{ user, setUser }}>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Register />} />} />
          <Route path="/dashboard" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Dashboard />} />} />
          <Route path="/solicitacao" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Requisition />} />} />
          <Route path="/profile" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Profile />} />} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter >
  )
}

export default App
