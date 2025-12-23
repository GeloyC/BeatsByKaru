import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'
import AddGenre from '../../components/AdminComponent/AddGenre';

const Manage = () => {
  const [genreMenuShow, setGenreMenuShow] = useState(false);
  const [isGenreWindowClosed, setIsGenreWidnowClosed] = useState(false);
  const base_url = `http://localhost:5000`;



  const handleCloseAddGenreWindow = () => {
    setIsGenreWidnowClosed(prev =>!prev )
  }


  const { data: genres = []} = useQuery({
      queryKey: ['genre'],
      queryFn: async () => {
          try {
              const response = await axios.get(`${base_url}/genre/all`, {
                  withCredentials: true
              });

              console.log(response.data)

              return response.data;
          } catch (err) {
              console.error('Error retreiving genre data: ', err);
          }
      }
  });

  return (
    <div className='relative flex flex-col w-full h-screen bg-[#FFF]'>
        <TopNav />

        <div className='relative grid grid-cols-[15%_85%] h-full w-full'>
            <SideNav />

            <div className='flex w-full h-full bg-[#FFF]'>

              {/* CONTENTS HERE */}
              <div className='flex flex-col w-full p-5 gap-5'>
                <span className='text-[28px] font-bold text-[#141414]'>Manage Contents</span>

                <div className='flex flex-col w-full justify-between gap-4'>
                  <div className='flex items-center justify-between gap-4 w-full pb-2 border-b border-b-[#DDD]'>
                    <span className='font-bold text-[18px] text-[#005F60]'>All Genres</span>
                    {!isGenreWindowClosed && (
                      <button onClick={handleCloseAddGenreWindow} className='p-1 px-2 bg-[#03f8c5] text-[#005F60] rounded-[#005F60] text-[16px] font-bold rounded-[5px] hover:bg-[#007F80] hover:text-[#FFF] active:bg-[#03f8c5]'>+ Add Genre</button>
                    )}
                  </div>

                  <div className='flex flex-wrap gap-1 w-full'>
                    {/* Genre block */}
                    {genres.map((genre) => (
                      <div key={genre.id} onMouseEnter={() => setGenreMenuShow(true)} onMouseLeave={() => setGenreMenuShow(false)} className='relative flex items-center justify-center w-[200px] h-[200px] bg-[#DDD] rounded-[5px]'>
                        <span className='absolute top-2 left-3 text-[20px] text-[#2A2A2A] font-bold'>{genre.name}</span>
                        
                        {genreMenuShow && (
                          <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-[15px] border-[#BABABA] border-2 border-dashed justify-center bg-[#FFF]'>
                            <button className='size-6 p-1 hover:bg-[#CCC] rounded-full'>
                              <img src="/src/assets/icons/edit-black.png" alt="edit-icon"/>
                            </button>
                            <button className='size-6 p-1.5 hover:bg-[#CCC] rounded-full'>
                              <img src="/src/assets/icons/clear_black.png" alt="clear-icon" />
                            </button>
                          </div>
                        )}

                        <img src={genre.cover_art_url} alt="" className='bg-cover w-full h-full'/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Genre Create */}
              {isGenreWindowClosed && (
                <AddGenre closeAddGenreWindow={handleCloseAddGenreWindow}/>
              )}
            </div>
        </div>

    </div>
  )
}

export default Manage