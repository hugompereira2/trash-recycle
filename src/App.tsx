import Home from './components/Home/Home'
import Navbar from "./components/Navbar/Navbar"
import Register from "./components/Register/Register"
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Register />} />
        </Routes>
      </div >
    </BrowserRouter >
  )
}

export default App
