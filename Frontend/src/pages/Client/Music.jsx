import React from 'react';
import { Link } from 'react-router-dom';

import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import { useGenre } from '../../../Hooks/GenreHook';

const Music = () => {
  const { data: genres = [], isLoading } = useGenre();


  return (
    <div className='relative flex flex-col w-full min-h-screen justify-start items-center'>
        <NavigationBar />

        <div className='flex flex-col w-full justify-center items-center px-[8rem] min-h-[800px] bg-[#1E1E1E] gap-10'>
          <label className='text-[#03f8c5] text-[80px] font-bold leading-[4rem]'>Get the beat you need</label>
          <span className='text-[#FFF] text-[20px]'>Add a simple and short paragraph here describing what the users can expect from this page</span>

          <div className='flex bg-[#FFF] w-[800px] p-1 gap-2'>
            <input type="text" className='p-2 w-full border-none focus:border-none focus:outline-none focus:ring-0 text-[16px]' placeholder='Search for a title' />
            <button type='button' className='text-[#141414] bg-[#03f8c5] px-6 hover:bg-[#FFD700] active:bg-[#03f8c5]'>Search</button>
          </div>

          <div className='flex flex-col gap-3 items-center justify-center'>
            <span className='text-[#FFF] text-[18px] font-bold'>Explore Genres</span>

            <div className='flex gap-2 overflow-wrap:break-word'>
              {genres.map((genre) => (
                <Link to={`/music/genre/${genre.name}`} key={genre.id} className='p-1 px-3 rounded-[10px] text-[18px] text-[#FFF] border border-[#FFF] hover:bg-[#2A2A2A] active:bg-[#141414]'>{genre.name}</Link>
              ))}
                <Link to='/music/genre/all'  className='p-1 px-3 rounded-[10px] text-[18px] text-[#FFF] border border-[#FFF] hover:bg-[#2A2A2A] active:bg-[#141414]'>Explore All</Link>
            </div>
          </div>

          <div className='flex flex-col gap-3 items-center justify-center'>
            <span className='text-[#FFF] text-[18px] font-bold'>Browse by Category</span>

            <div className='flex gap-2 overflow-wrap:break-word'>
              <button className='p-1 px-3 rounded-[10px] text-[18px] text-[#FFF] border border-[#FFF] hover:bg-[#2A2A2A] active:bg-[#141414]'>Beat Tapes</button>
              <button className='p-1 px-3 rounded-[10px] text-[18px] text-[#FFF] border border-[#FFF] hover:bg-[#2A2A2A] active:bg-[#141414]'>Bundles</button>
              <button className='p-1 px-3 rounded-[10px] text-[18px] text-[#FFF] border border-[#FFF] hover:bg-[#2A2A2A] active:bg-[#141414]'>All</button>
            </div>
          </div>

        </div>
        <Footer />
    </div>
  )
}

export default Music