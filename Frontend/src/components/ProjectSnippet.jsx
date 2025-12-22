import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ProjectSnippet = () => {



    return (
        <div className='flex flex-col w-full py-16 bg-[#141414] gap-16'>
            <div className='grid grid-cols-[40%_60%] w-full px-[8rem] justify-between'>
                <div className='flex flex-col items-start justify-between'>
                    <div className='flex flex-col items-start'>
                        <span className='text-[60px] text-[#FFF] font-bold leading-none'>HOP ON MY BEAT,</span> 
                        <span className='text-[60px] font-bold text-[#03f8c5] leading-none'>JUST LIKE THEM</span>
                        
                        <div className='pt-5 text-[#FFF] text-[18px]'>
                            <span>sdasdasdasdasdasd asdasdasd adsasd sdasdasd asdtapoasd askhjasmdkinbm lasdas</span>
                        </div>
                    </div>


                    <Link className='flex items-center bg-[#03f8c5] px-6 py-1 gap-2 hover:bg-[#EADCA7] hover:px-8 transition-all duration-200'>
                        <span className='whitespace-nowrap font-bold'>All My Projects</span>
                        <img src="/src/assets/icons/arrow_corner_down.png" alt="arrow-corner-down" className='size-8'/>
                    </Link>
                </div>

                <div className='grid grid-cols-3 w-full gap-2 '>
                    <div className='col-span-1 text-[#FFF] bg-[#FFF] h-[275px] rounded-[10px]'>
                        ...
                    </div>
                    <div className='col-span-1 text-[#FFF] bg-[#FFF] h-[275px] rounded-[10px]'>
                        ...
                    </div>
                    <div className='col-span-1 text-[#FFF] bg-[#FFF] h-[275px] rounded-[10px]'>
                        ...
                    </div>
                    <div className='col-span-3 text-[#FFF] bg-[#FFF] h-[275px] rounded-[10px]'>
                        ...
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProjectSnippet