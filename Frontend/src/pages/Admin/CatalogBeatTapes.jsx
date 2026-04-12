import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'
import { useBeatTapes } from '../../../Hooks/AudioHooks'
import BeatTapeCardWrapper from '../../components/AdminComponent/BeatTapeCardWrapper'

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

                    <div className='grid grid-cols-6 w-full gap-[1rem]'>
                        {beatTapes.map(beat => (
                            <BeatTapeCardWrapper beatData={beat} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CatalogBeatTapes