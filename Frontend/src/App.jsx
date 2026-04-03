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
import CatalogSingles from './pages/Admin/CatalogSingles.jsx'
import CatalogBeatTapes from './pages/Admin/CatalogBeatTapes.jsx'
import BeatTapeTracks from './pages/Admin/BeatTapeTracks.jsx'

function App() {
  
  const { user, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="music" element={<Music />} />
        <Route path='music/all' element={<AllMusic />} />
        <Route path='music/genre/:genre' element={<AllMusic />} />
        <Route path="projects" element={ <Projects /> }/>

        {/* Admin Routes */}
        <Route path='admin' element={ user ? <Navigate to='/dashboard'/> : <Login />}/>
        <Route path='dashboard' element={ user ? <Dashboard /> : <Navigate to='/admin'/>}/>
        <Route path='manage' element={ user ? <Manage /> : <Navigate to='/admin'/>}/>
        <Route path='create' element={ user ? <Create /> : <Navigate to='/admin'/>}/>
        <Route path='catalog/singles' element={ user ? <CatalogSingles /> : <Navigate to='/admin' /> }/>
        <Route path='catalog/beat-tapes' element={ user ? <CatalogBeatTapes /> : <Navigate to='/admin' /> }/>
        <Route path='catalog/beat-tapes/:id/tracks' element={ user ? <BeatTapeTracks /> : <Navigate to="/admin" /> } />
    </Routes>
  )
}

export default App
