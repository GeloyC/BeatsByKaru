import React from 'react'
import NavigationBar from '../../components/NavigationBar'
import HeaderGenres from '../../components/HeaderGenres'
import ProjectSnippet from '../../components/ProjectSnippet'
import LatestRelease from '../../components/LatestRelease'
import Footer from '../../components/Footer'

import { Link } from 'react-router-dom'

function Home() {

    return (
        <div className='relative flex flex-col justify-start w-full min-h-screen '>

            <NavigationBar />
            {/* CONTENT CONTAINER */}
            <div className='flex flex-col w-full h-auto gap-[8rem]'>

                {/* HEADER SECTION */}
                <div className='flex flex-col items-center justify-evenly w-full min-h-[725px] px-[8rem] bg-[#141414] rounded-b-[30px]'>
                    <div className="flex bg-[url('src/assets/Image/temporary_bg_image_resized.jpg')] h-[400px] w-full bg-[#FFF] bg-cover">
                        {/* Header Image Container */}
                        {/* <img src="/src/assets/Image/header_image.jpg" alt="" /> */}
                    </div>
                    
                    <div className='flex flex-col gap-10 py-10 box-border w-full'>
                        <span className='flex justify-center text-[#03f8c5] text-[193px] leading-[9rem] font-bold whitespace-nowrap'>BEATS BY KARU</span>

                        <div className='flex flex-row justify-between items-center'>
                            <div className='flex gap-2 justify-center'>
                                <Link to='/music' className='flex items-center gap-3 type-button bg-[#03f8c5] font-bold px-4 py-1 hover:px-6 hover:bg-[#EADCA7] active:px-4 transition-all duration-200'>
                                <span>Explore Music Collection</span>
                                <div className='size-8'>
                                    <img src="/src/assets/icons/arrow_corner_down.png" alt="arrow_down" />
                                </div>
                                </Link>
                            </div>

                            {/* Social Media Icons*/}
                            {/* TODO: Change color to  Peach -- #EADCA7*/}
                            <div className='flex items-center gap-6'>
                                <a target='_blank' className='size-12 rounded-full border-2 border-[#141414] p-1.5 bg-[#03f8c5] hover:bg-[#FFF] active:bg-[#FDB909] cursor-pointer'>
                                    <img src="/src/assets/icons/facebook_black.png" alt="facebook logo" />
                                </a>
                                <a target='_blank' className='size-12 rounded-full border-2 border-[#141414] p-1.5 bg-[#03f8c5] hover:bg-[#FFF] active:bg-[#FDB909] cursor-pointer'>
                                    <img src="/src/assets/icons/youtube_black.png" alt="youtube logo" />
                                </a>
                                <a target='_blank' className='size-12 rounded-full border-2 border-[#141414] p-1.5 bg-[#03f8c5] hover:bg-[#FFF] active:bg-[#FDB909] cursor-pointer'>
                                    <img src="/src/assets/icons/instagram_black.png" alt="instagram logo" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>


                <ProjectSnippet />
                <HeaderGenres />
                <LatestRelease />
                <Footer />
            </div>

        </div>
    )
}

export default Home
