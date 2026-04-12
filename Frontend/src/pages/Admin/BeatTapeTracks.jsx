import React from 'react'
import { useParams } from 'react-router-dom'

import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'

import { useBeatTapeCoverArt, useBeatTapeTracks } from '../../../Hooks/AudioHooks'
import { useAudioPlayer } from '../../../Hooks/useAudioPlayer'
import { formatTime } from '../../../helpers/timeFormat'

const BeatTapeTracks = () => {

    const { id } = useParams();
    const beatTapeId = id ? Number(id) : NaN;

    const { data: tracks = [] } = useBeatTapeTracks(beatTapeId)
    const { data: cover_art = [] } = useBeatTapeCoverArt(beatTapeId);

    console.log('beat tape ID: ', beatTapeId);
    console.log('track BT: ', tracks);

    return (
        <div className='relative flex flex-col min-h-screen w-full'>
            <TopNav />
            <div className='relative grid grid-cols-[15%_85%] w-full'>
                <SideNav />

                <div className='grid grid-cols-[2fr_3fr]'>
                    <div className='bg-[#FFF]'>
                        {cover_art.map(cover => (
                            <img src={cover.cover_art_url}/>
                        ))}
                    </div>

                    <div className='flex flex-col items-start gap-[2rem] p-[2rem] w-full'>
                        {tracks.map((track, index) => (
                            <div key={track.single_album_id} className='flex items-center gap-[1rem] w-full'>
                                <span className='text-[#FFF]'>{track.track_number}</span>
                                <div className='flex items-center justify-between w-full'>
                                    <span className='text-[#FFF] text-[18px] font-bold'>{track.title}</span>
                                    <span className='text-[#FFF]'>{formatTime(track.duration)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BeatTapeTracks