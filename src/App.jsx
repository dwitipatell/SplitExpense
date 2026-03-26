//MAIN JSX

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './pages/login'
import {BrowserRouter , Routes , Route} from "react-router-dom"
import Dashboard from './pages/dashboard'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
