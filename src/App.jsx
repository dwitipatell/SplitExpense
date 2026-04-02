import { Routes, Route } from "react-router-dom"
import Dashboard from './pages/dashboard'
import Login from "./pages/login"
import Signup from "./pages/signup"
import AddEvent from "./pages/addevent"
import Settings from "./pages/settings"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-event" element={<AddEvent />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App