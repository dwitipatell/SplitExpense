 //MAIN JSX

import {BrowserRouter , Routes , Route} from "react-router-dom"
import Dashboard from './pages/dashboard'
import Navbar from './components/navbar'
import Login from "./pages/login"

function App() {

  return (
    <BrowserRouter>
    
        <Login></Login>
    </BrowserRouter>
  )
}
export default App
