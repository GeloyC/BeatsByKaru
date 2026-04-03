import React from 'react'
import { useParams } from 'react-router-dom'

import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'

import { useBeatTapeTracks } from '../../../Hooks/AudioHooks'

const BeatTapeTracks = () => {

    const { id } = useParams();
    const beatTapeId = id ? Number(id) : NaN;

    const { data: tracks = [] } = useBeatTapeTracks(beatTapeId)

    console.log('beat tape ID: ', beatTapeId);
    console.log('track BT: ', tracks);

    return (
        <div className='relative flex flex-col min-h-screen w-full'>
            <TopNav />
            <div className='relative grid grid-cols-[15%_85%] w-full'>
                <SideNav />

                <div>{tracks.map(track => (
                    <span key={track.single_album_id}>{track.title}</span>
                ))}</div>
            </div>
        </div>
    )
}

export default BeatTapeTracks