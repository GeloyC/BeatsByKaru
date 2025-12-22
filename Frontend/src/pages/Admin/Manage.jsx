import React, { useState } from 'react'
import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'
import AddGenre from '../../components/AdminComponent/AddGenre';

const Manage = () => {
  const [genreMenuShow, setGenreMenuShow] = useState(false);
  const [isGenreWindowClosed, setIsGenreWidnowClosed] = useState(false);


  const handleCloseAddGenreWindow = () => {
    setIsGenreWidnowClosed(prev =>!prev )
  }

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
                    <div onMouseEnter={() => setGenreMenuShow(true)} onMouseLeave={() => setGenreMenuShow(false)} className='relative flex items-center justify-center w-[200px] h-[200px] bg-[#DDD] rounded-[5px]'>
                      <span className='absolute top-2 left-3 text-[20px] text-[#2A2A2A] font-bold'>Genre Name</span>
                      
                      {genreMenuShow && (
                        <div className='flex items-center gap-2 p-2 rounded-[15px] border-[#BABABA] border-2 border-dashed justify-center'>
                          <button className='size-6 p-1 hover:bg-[#FFF] rounded-full'>
                            <img src="/src/assets/icons/edit-black.png" alt="edit-icon"/>
                          </button>
                          <button className='size-6 p-1.5 hover:bg-[#FFF] rounded-full'>
                            <img src="/src/assets/icons/clear_black.png" alt="clear-icon" />
                          </button>
                        </div>
                      )}
                    </div>
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