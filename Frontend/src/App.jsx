import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Music from './pages/Client/Music.jsx'
import Projects from './pages/Client/Projects.jsx'
import Home from './pages/Client/Home.jsx'
import AllMusic from './pages/Client/AllMusic.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import Manage from './pages/Admin/Manage.jsx'
import Create from './pages/Admin/Create.jsx'
import Login from './pages/Admin/Login.jsx'

function App() {

  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="music" element={<Music />} />
        <Route path='music/all' element={<AllMusic />} />
        <Route path="projects" element={ <Projects /> }/>


        <Route path='admin' element={<Login />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='manage' element={<Manage />} />
        <Route path='create' element={<Create />} />
    </Routes>
  )
}

export default App
