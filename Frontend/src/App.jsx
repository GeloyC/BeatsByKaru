import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { useUser } from './components/AdminComponent/userContext.jsx'

import Music from './pages/Client/Music.jsx'
import Projects from './pages/Client/Projects.jsx'
import Home from './pages/Client/Home.jsx'
import AllMusic from './pages/Client/AllMusic.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import Manage from './pages/Admin/Manage.jsx'
import Create from './pages/Admin/Create.jsx'
import Login from './pages/Admin/Login.jsx'
import EditGenre from './components/AdminComponent/EditGenre.jsx'

function App() {
  
  const { user, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="music" element={<Music />} />
        <Route path='music/all' element={<AllMusic />} />
        <Route path="projects" element={ <Projects /> }/>


          <Route path='admin' element={
            user ? <Navigate to='/dashboard'/> : <Login />
          } />

          <Route path='dashboard' element={
            user ? <Dashboard /> : <Navigate to='/admin'/>
          } />

          <Route path='manage' element={<Manage />} />

          <Route path='create' element={<Create />} />
    </Routes>
  )
}

export default App
