import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='flex flex-col p-[6rem] px-[8rem] gap-7 w-full bg-[#03f8c5]'>
            <div className='grid grid-cols-[60%_20%_20%] place-items-start p-4'>
                <div className='font-bold text-[#141414] text-[36px]'>
                    Experience Music
                </div>

                <div className='flex flex-col items-end gap-3'>
                    <span className='text-[24px] font-bold leading-tight'>COMPANY</span>
                    <div className='flex flex-col gap-2 items-end justify-start'>
                        <Link to='/about'  className='text-[18px] hover:underline'>About the Artist</Link>
                        <Link to='/projects' className='text-[18px] hover:underline'>Projects</Link>
                        <Link to='/music' className='text-[18px] hover:underline'>Music</Link>
                    </div>
                </div>

                <div className='flex flex-col items-end gap-3'>
                    <span className='text-[24px] font-bold leading-tight'>CONTACTS</span>
                    <div className='flex flex-col gap-2 items-end justify-start'>
                        <span className='text-[18px]'>Phone: 09123456789</span>
                        <span className='text-[18px] whitespace-nowrap'>Email: Anonymous06@gmail.com</span>
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-end gap-5 w-full'>
                <a target='_blank' className='size-12 rounded-full border-2 border-[#141414] p-2 hover:bg-[#FFF] active:bg-[#FDB909] cursor-pointer'>
                    <img src="/src/assets/icons/facebook_black.png" alt="facebook logo" />
                </a>
                <a target='_blank' className='size-12 rounded-full border-2 border-[#141414] p-2 hover:bg-[#FFF] active:bg-[#FDB909] cursor-pointer'>
                    <img src="/src/assets/icons/youtube_black.png" alt="youtube logo" />
                </a>
                <a target='_blank' className='size-12 rounded-full border-2 border-[#141414] p-2 hover:bg-[#FFF] active:bg-[#FDB909] cursor-pointer'>
                    <img src="/src/assets/icons/instagram_black.png" alt="instagram logo" />
                </a>
            </div>

            <label className='leading-tight text-[#141414] text-[190px] font-bold text-center whitespace-nowrap'>BEATS BY KARU</label>

            <span className='text-[22px]'>Copyright © Beats By Karu</span>
        </div>
    )
}

export default Footer