//MAIN JSX

import {BrowserRouter , Routes , Route} from "react-router-dom"
import Dashboard from './pages/dashboard'
import Navbar from './components/navbar'
import Login from "./pages/login"

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
        <Routes>
            <Route path='login' element={<Login/>}/>
            <Route path='/' element={<Dashboard/>}/>
        </Routes>
    </BrowserRouter>
  )
}
export default App
