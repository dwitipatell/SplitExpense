import { Routes, Route } from "react-router-dom"
import Dashboard from './pages/dashboard'
import Navbar from './components/navbar'
import Login from "./pages/login"
import Signup from "./pages/signup"
import "./utils/splitlogic";
import AddEvent from "./pages/addevent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-event" element={<AddEvent />} />
    </Routes>
  )
}

export default App