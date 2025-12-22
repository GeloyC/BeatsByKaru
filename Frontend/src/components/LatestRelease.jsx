import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LatestRelease = () => {

    // TODO: Appear on Hover based on id or inde
    // > Add title
    // > Type: Beat tape or Bundle
    // > Genre
    // > Buy Button 
    // > Price
    // > Key & BPM
    // > Number of beats in a bundle 
    
    return (
        <div className='flex flex-col items-center justify-center px-[8rem] gap-10 w-full'>
            <div className='flex flex-col w-full items-center justify-center gap-4'>
                <span className='text-[60px] text-[#FFF] font-bold leading-none'>LATEST RELEASE</span>
                <span className='text-[20px] text-[#FFF] w-full text-center'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit na malupet
                </span>
            </div>

            <div className='grid grid-cols-2 w-full place-items-start gap-10'>
                <div className='flex flex-col w-full gap-5'>
                    <div className='flex flex-col w-full items-start justify-start gap-4'>
                        <span className='text-[30px] text-[#FFF] font-bold leading-none'>Beat Tapes</span>
                        <span className='text-[20px] text-[#FFF] w-full'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        </span>
                    </div>

                    <div className='flex flex-col w-full gap-2'>

                        {/* Block of Beat Tape */}
                        <div className='flex justify-center border border-[#2A2A2A] rounded-[5px] p-2 transform transition-all duration-100 hover:-translate-x-1 cursor-pointer'>
                            <div className='flex items-center justify-center h-[120px] w-[150px] rounded-[10px] overflow-hidden'>
                                <img src="/src/assets/Image/sample_bundle_art.jpg" alt="cover-art" className='h-auto w-auto object-contain'/>
                            </div>
                            
                            <div className='flex items-center justify-center w-[120px]'>
                                <button className='flex items-center justify-center size-16 rounded-full border-[#FFF] border hover:bg-[#2A2A2A] active:bg-[#141414]'>
                                    <img src="/src/assets/icons/play_yellow.png" alt="" className='size-10 pl-1'/>
                                </button>
                            </div>

                            <div className='flex flex-col w-full justify-center'>
                                <Link className='text-[#03f8c5] text-[18px] font-bold hover:underline active:text-[#EADCA7]'>The Most Amazing title</Link>
                                <div className='flex gap-2 items-center text-[14px] text-[#FFF]'>
                                    <div className='flex gap-1 items-center'>
                                        <Link className='hover:underline'>Hip-Hop</Link>
                                    </div>
                                    <span>|</span>
                                    <div className='flex gap-1 items-center'>
                                        <span>A min Key</span>
                                    </div>
                                    <span>|</span>
                                    <div className='flex gap-1 items-center'>
                                        <span>80 BPM</span>
                                    </div>
                                    <span>|</span>
                                    <div className='flex gap-1 items-center'>
                                        <Link className='hover:underline'>Bundle Vol. 1</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        

                    </div>

                    

                    <Link className='flex w-fit items-center text-[#141414] bg-[#03f8c5] px-2 py-1 font-bold active:bg-[#03f8c5] hover:bg-[#EADCA7]'>
                        Show More
                    </Link>
                </div>

                <div className='flex flex-col w-full gap-5'>
                    <div className='flex flex-col w-full items-start justify-start gap-4'>
                        <span className='text-[30px] text-[#FFF] font-bold leading-none'>Bundles</span>
                        <span className='text-[20px] text-[#FFF] w-full'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        </span>
                    </div>

                    <div className='flex flex-col gap-4 w-full'>
                        {/* block of bundle */}
                        <div className='flex items-start h-[250px] w-full gap-4 text-[#FFF] transform transition-all duration-100 hover:-translate-x-1 rounded-[5px]'>
                            <div className='flex w-[250px] h-full overflow-hidden rounded-[5px]'>
                                <img src="/src/assets/Image/sample_bundle_art.jpg" alt="" />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col gap-1'>
                                    <Link className='text-[22px] font-bold hover:underline active:text-[#03f8c5]'>Bundle Title Vol. 1 Pack You</Link>
                                    <span className='text-[18px] '>Genre: asdasdas</span>
                                    <span className='italic'>12 Beat Tapes</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-start h-[250px] w-full gap-4 text-[#FFF] transform transition-all duration-100 hover:-translate-x-1 rounded-[5px]'>
                            <div className='flex w-[250px] h-full overflow-hidden rounded-[5px]'>
                                <img src="/src/assets/Image/sample_bundle_art.jpg" alt="" />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <Link className='text-[22px] font-bold hover:underline active:text-[#03f8c5]'>Bundle Title Vol. 1 Pack You</Link>
                                <span className='text-[18px] '>Genre: asdasdas</span>
                                <span className='italic'>12 Beat Tapes</span>
                            </div>
                        </div>
                    </div>

                    <Link className='flex w-fit items-center text-[#141414] bg-[#03f8c5] px-2 py-1 font-bold active:bg-[#03f8c5] hover:bg-[#EADCA7]'>
                        Show More
                    </Link>
                </div>

                {/* <div className='flex w-full justify-between items-center pt-3'>
                    <span className='text-[40px] text-[#005F60] font-bold leading-tight'>Beat Tapes</span>
                    <Link className='flex items-center gap-2 bg-[#03f8c5] px-5 py-1 hover:px-7 hover:bg-[#EADCA7] active:px-5 transition-all duration-200'>
                        <span className='font-bold text-[18px]'>See More Beat Tapes</span>
                        <img src="/src/assets/icons/arrow_corner_down.png" alt="arrow-down" className='size-7' />
                    </Link>
                </div> */}

                



                
            </div>
        </div>
    )
}

export default LatestRelease