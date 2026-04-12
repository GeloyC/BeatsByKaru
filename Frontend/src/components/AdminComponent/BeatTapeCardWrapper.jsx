import React from 'react'
import { Link } from 'react-router-dom'

const BeatTapeCardWrapper = ({ beatData }) => {

    return (
        <Link key={beatData.id} to={`/catalog/beat-tapes/${beatData.id}/tracks`}
        className='group rounded-[10px] border-box transition-all duration-100 active:translate-y-0.5'>
            <div className='flex flex-col gap-2'>
                <div className='min-w-[200px] h-[250px] rounded-[5px] overflow-hidden'>
                    <img loading={'eager'} src={beatData.cover_art_url} alt="cover-art"  className='w-full h-full object-cover'/>
                </div>

                <div className='flex flex-col items-start justify-between'>
                    <div className='flex items-center justify-between w-full'>
                        <span className='text-[#FFF] font-bold'>{beatData.title}</span>
                        <div className='w-[35px] h-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-100'>
                            <img src="/src/assets/icons/arrow-narrow-white.png" alt="arrow" />
                        </div>
                    </div>

                    <div className='flex items-center gap-2 opacity-50'>
                        <span className='font-bold text-[#FFF]'>{beatData.number_of_tracks}</span>
                        <span className='text-[#FFF]'>Tracks</span>
                    </div>
                </div>

            </div>
        </Link>
    )
}

export default BeatTapeCardWrapper