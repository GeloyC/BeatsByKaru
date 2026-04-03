import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'
import { useBeatTapes } from '../../../Hooks/AudioHooks'

const CatalogBeatTapes = () => {

    const { data: beatTapes = [] } = useBeatTapes();
    console.log('Beat tape catalog: ', beatTapes);

    return (
        <div className='relative flex flex-col min-h-screen w-full'>
            <TopNav />

            <div className='relative grid grid-cols-[15%_85%] w-full'>
                <SideNav />

                <div className='flex flex-col justify-start w-full p-5 bg-[#141414] gap-[1rem]'>
                    <span className='text-[28px] font-bold text-[#FFF]'>Beat Tapes</span>

                    <div className='grid grid-cols-5 w-full gap-2'>
                        {beatTapes.map((beats) => (
                            <Link key={beats.id} to={`/catalog/beat-tapes/${beats.id}/tracks`}
                            className='group border border-[#FFF]/25 rounded-[10px] bg-[#BBB]/10 p-4 border-box hover:border-[#FFF]/50 transition-all duration-100 active:translate-y-0.5'>
                                <div className='flex flex-col gap-2'>
                                    <div className='min-w-[200px] h-[250px] rounded-[5px] overflow-hidden'>
                                        <img loading={'eager'} src={beats.cover_art_url} alt="cover-art"  className='w-full h-full object-cover'/>
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <span className='text-[#FFF] font-bold'>{beats.title}</span>
                                        <div className='w-[35px] h-[30px] opacity-0 group-hover:opacity-75 transition-opacity duration-100'>
                                            
                                                <img src="/src/assets/icons/arrow-narrow.png" alt="arrow" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CatalogBeatTapes