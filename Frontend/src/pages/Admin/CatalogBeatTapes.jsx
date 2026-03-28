import React from 'react'
import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'
import { useBeatTapes } from '../../../Hooks/AudioHooks'

const CatalogBeatTapes = () => {

    const { data: beatTapes = [] } = useBeatTapes();
    console.log('Beat tape catalog: ', beatTapes);

    return (
        <div className='relative flex flex-col min-h-screen w-full bg-[#FFF]'>
            <TopNav />

            <div className='relative grid grid-cols-[15%_85%] w-full bg-[#FFF]'>
                <SideNav />

                <div className='flex flex-col justify-start w-full p-5 bg-[#FFF]'>
                    <span className='text-[28px] font-bold text-[#141414]'>Beat Tapes</span>

                    <div className='flex flex-col w-full h-auto pt-[1rem] gap-2'>
                        {beatTapes.map((beats) => (
                            <div key={beats.album_id}>
                                <div className='flex flex-col'>
                                    {beats.title}
                                    <div className='flex flex-col'>
                                        {beats.tracks.map(tracks => (
                                            <div key={tracks.audio_id}>{tracks.title}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CatalogBeatTapes