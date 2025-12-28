import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'
import AddGenre from '../../components/AdminComponent/AddGenre';
import EditGenre from '../../components/AdminComponent/EditGenre';
import { useGenre } from '../../../Hooks/GenreHook';
import ManageLicense from '../../components/AdminComponent/ManageLicense';

const Manage = () => {
  const base_url = `http://localhost:5000`;
  const queryClient = useQueryClient();

  const [successMessage, setSuccessMessage] = useState('');
  const [isGenreWindowClosed, setIsGenreWidnowClosed] = useState(false);
  const [isGenreHovered, setIsGenreHovered] = useState(false);
  const [genreId, setGenreId] = useState('');



  const handleCloseAddGenreWindow = () => {
    setIsGenreWidnowClosed(prev =>!prev )
  }


  // retrieve data: genres
  const { data: genres = [] } = useGenre();

  const hoverGenreMenu = (genre_id) => {
    setIsGenreHovered(prev => (prev === genre_id ? null : genre_id))
  }


  const { mutate: deleteGenre } = useMutation({
    mutationFn: async (genre_id) => {
      const response = await axios.delete(`${base_url}/genre/remove/${genre_id}`, {
        withCredentials: true
      });

      console.log('Deleted: ', response.data);
    },
    onSuccess: () => {
      alert('Delete sucess');
      queryClient.invalidateQueries(['genre']);
    }, 
    onError: (err) => {
      console.error('Error removing genre: ', err);
    }
  });


  const handleEditGenre = (genre_id) => {
    setGenreId(genre_id);
    console.log('The genrenetics: ', genre_id);
  }


  return (
    <div className='relative flex flex-col w-full min-h-screen bg-[#FFF]'>
        <TopNav />

        <div className='relative grid grid-cols-[15%_85%] h-full w-full'>
            <SideNav />

            <div className='relative flex w-full h-full bg-[#FFF]'>

              {/* CONTENTS HERE */}
              <div className='flex flex-col w-full p-5 gap-5'>
                <span className='text-[28px] font-bold text-[#141414]'>Manage Contents</span>

                {/* manage genres */}
                <section className='flex flex-col w-full gap-4'>
                  <div className='flex items-center justify-between gap-4 w-full pb-2 border-b border-b-[#DDD]'>
                    <span className='font-bold text-[18px] text-[#005F60]'>All Genres</span>
                    {!isGenreWindowClosed && (
                      <button onClick={handleCloseAddGenreWindow} className='p-1 px-2 bg-[#03f8c5] text-[#005F60] rounded-[#005F60] text-[16px] font-bold rounded-[5px] hover:opacity-75 active:opacity-100'>+ Add Genre</button>
                    )}
                  </div>

                  <div className='flex flex-wrap gap-1 w-full'>
                    {/* Genre block */}
                    {genres.map((genre) => (
                      <div key={genre.id} onMouseEnter={() => hoverGenreMenu(genre.id)} onMouseLeave={() => hoverGenreMenu(null)} className={`relative flex items-center justify-center w-[200px] h-[200px] bg-[#DDD] rounded-[5px] overflow-hidden bg-cover bg-center`}>

                        {/* Cover art is displayed here */}
                        <div className={`absolute inset-0 bg-cover bg-center`} 
                          style={{backgroundImage: `url(${genre.cover_art_url})`}}
                        />

                        <div className="absolute inset-0 bg-black/40" />

                        <span className='absolute top-2 left-3 text-[20px] text-[#FFF] font-bold'>{genre.name}</span>
                        
                        {isGenreHovered === genre.id && (
                          <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-[15px] border-[#BABABA] border-2 border-dashed justify-center bg-[#FFF]'>
                            <button onClick={() => handleEditGenre(genre.id)} className='size-6 p-1 hover:bg-[#CCC] active:bg-[#FFF] rounded-full'>
                              <img src="/src/assets/icons/edit-black.png" alt="edit-icon"/>
                            </button>
                            <button onClick={() => deleteGenre(genre.id)} className='size-6 p-1.5 hover:bg-[#CCC] active:bg-[#FFF] rounded-full'>
                              <img src="/src/assets/icons/clear_black.png" alt="clear-icon" />
                            </button>
                          </div>
                        )}

                        
                      </div>
                    ))}
                  </div>
                </section>

                {/* manage license type */}
                <ManageLicense />
                
              </div>

              {/* Genre Create */}
              {isGenreWindowClosed && (<AddGenre closeAddGenreWindow={handleCloseAddGenreWindow}/>)}
              {genreId && ( <EditGenre genre_id={genreId} onClose={() => setGenreId('')}/> )}

            </div>
        </div>

    </div>
  )
}

export default Manage