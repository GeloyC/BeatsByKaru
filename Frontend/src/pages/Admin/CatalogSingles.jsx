import React, { useRef, useState } from 'react'
import TopNav from '../../components/AdminComponent/TopNav.jsx'
import SideNav from '../../components/AdminComponent/SideNav.jsx'
import { useSingle } from '../../../Hooks/AudioHooks.js'

const CatalogSingles = () => {

    const { data: singleTracks = [] } = useSingle();
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef({});
    const toggleAudioPlay = (audio_id) => {
        try {
            let audio = audioRef.current[audio_id];
            if (!audio) return;

            let prev_audio_id = playingId;
            
            if (prev_audio_id === audio_id) {
                audio.pause();
                setPlayingId(null);

                return;
            } 

            if (prev_audio_id !== null && audioRef.current[prev_audio_id]) {
                audioRef.current[prev_audio_id].pause();
            }

            audio.play();
            setPlayingId(audio_id);
        } catch (err) {
            console.error('Error playing audio: ', err);
        }
    }

    return (
        <div className='relative flex flex-col min-h-screen w-full'>
            <TopNav />
            <div className='relative grid grid-cols-[15%_85%] w-full'>
                <SideNav />

                <div className='flex flex-col justify-start w-full p-5 bg-[#141414]'>
                    <span className='text-[28px] font-bold text-[#FFF]'>Singles</span>

                    <div className='flex flex-col w-full h-auto pt-[1rem]'>
                        <div className='grid grid-cols-[5%_10%_25%_15%_10%_15%_10%_10%] place-items-start w-full h-[25px] border-b border-[#6A6A6A]'>
                            <div className='flex items-center w-full text-[14px] text-[#FFF] opacity-50'>Track id</div>
                            <div className='flex items-center w-full text-[14px] text-[#FFF] opacity-50'>Duration</div>
                            <div className='flex items-center w-full text-[14px] text-[#FFF] opacity-50'>Track Name</div>
                            <div className='flex items-center w-full text-[14px] text-[#FFF] opacity-50'>Date Created</div>
                            <div className='flex items-center w-full text-[14px] text-[#FFF] opacity-50'>Date Updated</div>
                            <div className='flex items-center w-full text-[14px] text-[#FFF] opacity-50'>Release Date</div>
                            <div className='flex items-center w-full text-[14px] text-[#FFF] opacity-50'>Price</div>
                            <div className='flex items-center w-full text-[14px] text-[#FFF] opacity-50'>Status</div>
                        </div>

                        <div className='flex flex-col w-full'>
                            {singleTracks.map((audio) => (
                                <div key={audio.album_id} className='grid grid-cols-[5%_10%_25%_15%_10%_15%_10%_10%] place-items-center w-full h-[40px] border-b border-[#CCC]/25 hover:bg-[#FFF]/10'>
                                    <div className='flex items-center w-full text-[#FFF] text-[14px]'>{audio.album_id}</div>
                                    <div className='flex items-center w-full text-[#FFF] text-[14px]'>{formatTime(audio.duration)}</div>
                                    <div className='flex gap-2 items-center w-full text-[14px]'>
                                        <button onClick={() => toggleAudioPlay(audio.album_id) }>{
                                        playingId === audio.album_id ? (
                                            <img src="/src/assets/icons/pause_black.png" alt="play" className='w-[20px] h-[20px] opacity-75'/>
                                        ) : (
                                            <img src="/src/assets/icons/play_black.png" alt="pause" className='w-[20px] h-[20px] opacity-75'/>
                                        )
                                    }</button>
                                        <span className='w-[200px] truncate text-[#FFF]'>{audio.title}</span>
                                        <audio ref={(aud) => {audioRef.current[audio.album_id] = aud}} src={audio.audio_tagged_url} controls hidden></audio>
                                    </div>
                                    <div className='flex items-center w-full text-[14px] text-[#FFF]'>{new Date(audio.date_created).toLocaleDateString()}</div>
                                    <div className='flex items-center w-full text-[14px] text-[#FFF]'>{new Date(audio.date_updated).toLocaleDateString()}</div>
                                    <div className='flex items-center w-full text-[14px] text-[#FFF]'>{new Date(audio.release_date).toLocaleDateString()}</div>
                                    <div className='flex items-center w-full text-[14px] text-[#FFF]'>{new Intl.NumberFormat('en-PH', {
                                        style: 'currency',
                                        currency: 'php'
                                    }).format(audio.price)}</div>
                                    <div className='flex items-center w-full text-[14px] text-[#FFF]'>{audio.status}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CatalogSingles