import React from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'

const NavigationBar = () => {
    const location = useLocation();

    return (
        <div className='sticky top-0 z-10 grid grid-cols-[80%_20%] w-full justify-between items-center bg-[#141414] px-[8rem] box-border'>
            <div className='flex items-center gap-4 box-border'>
                {/* Logo */}
                <span className="text-[#03f8c5] font-bold text-3xl" >Logo</span>
                <div className='flex justify-start items-center w-full text-[#FFF] place-items-center'>
                    {/* Links */}
                    <Link to="/" className={`${location.pathname === '/' ? 'text-[#03f8c5] border-b-4 border-b-[#03f8c5]' : 'text-[#FFF]'} box-border p-6 px-7 hover:text-[#03f8c5] active:text-[#EADCA7] font-bold w-fit text-center`}>Home</Link>
                    <Link to="/music" className={`${location.pathname === '/music' ? 'text-[#03f8c5] border-b-4 border-b-[#03f8c5]' : 'text-[#FFF]'} p-6 px-7 hover:text-[#03f8c5] active:text-[#EADCA7] font-bold w-fit text-center`}>Music</Link>
                    <Link to="/projects" className={`${location.pathname === '/projects' ? 'text-[#03f8c5] border-b-4 border-b-[#03f8c5]' : 'text-[#FFF]'} p-6 px-7 hover:text-[#03f8c5] active:text-[#EADCA7] font-bold w-fit text-center`}>Projects</Link>
                </div>
            </div>

            <div className='flex w-full items-center justify-end'>
                <Link to="/about" className='flex items-center justify-end gap-2 bg-[#03f8c5] hover:bg-[#EADCA7] hover:px-4 active:px-3 px-3 py-1 font-bold transition-all duration-200'>
                    <span>About The Artist</span>
                    <div className='size-7'>
                        <img src="/src/assets/icons/arrow_corner_down.png" alt="arrow_down" />
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default NavigationBar