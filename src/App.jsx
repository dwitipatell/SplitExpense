import {Routes , Route} from "react-router-dom"
import Dashboard from './pages/dashboard'
import Navbar from './components/navbar'
import Login from "./pages/login"
import Signup from "./pages/signup"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
export default App
