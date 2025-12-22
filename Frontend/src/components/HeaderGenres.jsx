import React from 'react'
import { Link } from 'react-router-dom'

const HeaderGenres = () => {
    return (
        <div className='flex flex-col w-full bg-[#141414] gap-10'>
            <div className='flex flex-col py-10 px-[8rem]'>
                <div className='flex items-center justify-start'>
                    <span className='text-[75px] text-[#FFF] font-bold'>
                        LOTS OF <span className='text-[#007F80]'>GENRES</span> TO EXPLORE
                    </span>
                </div>

                <div className='flex w-full justify-start items-center text-right'>
                    <span className='text-[20px] text-[#FFF] leading-tight'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
                    </span>
                </div>
            </div>


            {/* 
                TODO: Scale image inside every genre box when hovered
            */}
            <div className='flex items-center justify-start px-[8rem] w-full'>

                <div className='grid grid-cols-6 w-[1500px] h-[225px] gap-1'>

                        <Link className='relative flex bg-[#007F80] cursor-pointer overflow-hidden text-[24px] rounded-[5px] hover:text-[26px] text-[#FFF] hover:text-[#EADCA7] active:text-[25px] transition-all duration-100'>
                            <span className='absolute top-3 left-5  font-bold'>Genre</span>
                        </Link>

                </div>
            </div>

            {/* <div className='flex items-center justify-start w-full px-[8rem] py-10'>

                <Link className='flex items-center gap-4 bg-[#03f8c5] px-6 py-2 hover:px-8 hover:bg-[#EADCA7] active:bg-[#03f8c5] active:px-6 transition-all duration-200'> 
                    <span className='text-[18px] text-[#141414] font-bold'>Explore All</span>
                    <img src="/src/assets/icons/explore_black.png" alt="explore-icon" className='size-6 object-cover' />
                </Link>
            </div> */}
        </div>
    )
}

export default HeaderGenres