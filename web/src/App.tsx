import Home from './components/Home/Home'
import Navbar from "./components/Navbar/Navbar"
import Register from "./components/Register/Register"
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import ProtectedRoute, { ProtectedRouteProps } from "./utils/PrivateRoute";

function App() {

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    authenticationPath: '/',
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Register />} />} />
          <Route path="/dashboard" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Dashboard />} />} />
          <Route path="/profile"  element={<Profile />} />
        </Routes>
      </div >
    </BrowserRouter >
  )
}

export default App
