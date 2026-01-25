import React, { useState, useRef } from 'react'
import { useQuery,useQueryClient } from '@tanstack/react-query';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import { useAudio } from '../../../Hooks/AudioHooks';

const AllMusic = () => {
    const [selected, setSelected] = useState('');

    // Use this state to hover a list depending on audio_id or audio index
    const [isHovering, setIsHovering] = useState(false);

    const [selectionDisplayed, setSelectionDisplayed] = useState(false);
    const handleDisplaySelection = () => {
        setSelectionDisplayed(prev => !prev)
    }

    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef({});

    //to play/pause audio
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

            console.log('Playing: ', audio_id)
        } catch (err) {
            console.error('Error playing audio: ', err);
        }
    }

    const {data: audios = [] } = useAudio();

    return (
        <div className='relative w-full justify-center items-start min-h-screen bg-[#FFF]'>
            <NavigationBar />

            {/* Search filter */}
            <div className='flex w-full justify-center items-center p-2 border-b border-b-[#E1E1E1]'>
                <input type="text" placeholder='Search' className='py-1 px-3 w-[500px] text-[14px] rounded-[5px] border-none focus:border-none focus:outline-none bg-[#E1E1E1]'/>
            </div>

            {/* MAIN CONTENT */}
            <div className='flex flex-col justify-start items-center w-full px-[8rem] min-h-[750px] gap-4 '>
                <div className='flex flex-col w-full items-start justify-center py-[2rem] gap-5'>
                    <div className='relative flex items-center justify-center gap-4'>
                        <div className='text-[#141414] text-[48px] font-bold leading-[35px]'>Hip-Hop</div>
                        <button onClick={handleDisplaySelection} className='flex items-center justify-center'>
                            <img src="/src/assets/icons/arrow-down-sign-to-navigate.png" alt="dropdown-arrow"  className={`${selectionDisplayed ? 'rotate-180' : 'rotate-0'} size-5`}/>
                        </button>

                        { selectionDisplayed && (
                            <div className='absolute top-14 left-0 flex flex-col items-start w-[200px] max-h-[300px] overflow-y-scroll scrollbar-thin bg-[#FFF] border border-[#BABABA] rounded-[5px]'>
                                <button className='flex px-5 py-1 hover:bg-[#dddddd] active:bg-[#FFF] w-full'>Selection 1</button>
                                <button className='flex px-5 py-1 hover:bg-[#dddddd] active:bg-[#FFF] w-full'>Selection 2</button>
                                <button className='flex px-5 py-1 hover:bg-[#dddddd] active:bg-[#FFF] w-full'>Selection 3</button>
                            </div>
                        )}
                    </div>

                    <span className='text-[#141414]'>
                        Add a short description about the user's selected filter (genre/category)
                    </span>

                    <div className='flex gap-2 items-center justify-start'>
                        <label htmlFor="beat_tapes" className={`${selected === 'Beat Tapes' ? 'bg-[#03f8c5] border-[#007F80]' : 'border-[#141414]' } px-3 py-1 border rounded-[5px] hover:opacity-75 cursor-pointer`}>
                            Beat Tapes
                            <input type="radio" name="filter" id="beat_tapes" value={"Beat Tapes"} onChange={(e) => setSelected(e.target.value)} className='hidden'/>
                        </label>
                        
                        <label htmlFor="bundles" className={`${selected === 'Bundles' ? 'bg-[#03f8c5] border-[#007F80]' : 'text-[#141414] border-[#141414]' } px-3 py-1 border  rounded-[5px] hover:opacity-75 cursor-pointer`}>
                            Bundles
                            <input type="radio" name="filter" id="bundles" value={"Bundles"} onChange={(e) => setSelected(e.target.value)} className='hidden'/>
                        </label>

                        <label htmlFor="all" className={`${selected === 'All' ? 'bg-[#03f8c5] border-[#007F80]' : 'border-[#141414]' } px-3 py-1 border  rounded-[5px] hover:opacity-75 cursor-pointer`}>
                            All
                            <input type="radio" name="filter" id="all" value={"All"} onChange={(e) => setSelected(e.target.value)} className='hidden'/>
                        </label>
                    </div>
                </div>


                <span className='flex flex-row items-start w-full text-[24px] text-[#141414] font-bold'>Beat Tapes</span>
                <div className='grid grid-cols-[5%_5%_20%_25%_10%_10%_10%_15%] place-items-start w-full h-[30px] border-b border-[#BABABA]'>
                    {/* Headers */}
                    <div className='text-[#6A6A6A] text-[14px]'>BEAT TAPE</div>
                    <div className='text-[#6A6A6A] text-[14px]'></div>
                    <div className='text-[#6A6A6A] text-[14px]'>TITLE</div>
                    <div className='text-[#6A6A6A] text-[14px]'>Audio</div>
                    <div className='text-[#6A6A6A] text-[14px]'>DURATION</div>
                    <div className='text-[#6A6A6A] text-[14px]'>KEY</div>
                    <div className='text-[#6A6A6A] text-[14px]'>BPM</div>
                    <div className='text-[#6A6A6A] text-[14px]'>BUY</div>
                </div>
                
                {/* Contents */}
                <div className='flex flex-col h-auto w-full'>
                    {audios.map((audio) => (
                    <div key={audio.id} className='grid grid-cols-[5%_5%_20%_25%_10%_10%_10%_15%] place-items-center justify-items-start w-full h-auto py-2 border-b border-[#DDD]'>
                        <div className='flex items-center justify-center overflow-hidden w-full'>
                            <img src={audio.cover_art_url} alt="" className='size-10 object-cover'/>
                        </div>

                        <div className='flex items-center justify-center overflow-hidden w-full opacity-25 hover:opacity-100 active:opacity-25 cursor-pointer'>
                            <button onClick={() => toggleAudioPlay(audio.id)}>
                                <img src="/src/assets/icons/play_black.png" alt="" className='size-8 object-cover'/>
                            </button>
                        </div>
                        <span className='flex w-full text-[16px] text-[#141414]'>{audio.title}</span>
                        <audio ref={(aud) => {audioRef.current[audio.id] = aud}} src={audio.audio_tagged_url} controls></audio>
                        <span className='flex w-full text-[16px] text-[#141414]'>{audio.duration}</span>
                        <span className='flex w-full text-[16px] text-[#141414]'>{audio.audio_key}</span>
                        <span className='flex w-full text-[16px] text-[#141414]'>{audio.bpm}</span>

                    </div>
                    ))}
                </div>
                

                <div className='flex flex-col w-full items-start gap-2 py-[2rem]'>
                    <span className='text-[24px] text-[#141414] font-bold'>Bundles</span>
                    <div className='grid grid-cols-5 w-full gap-2'>

                        <div className='flex flex-col justify-center border border-[#DDDDDD] bg-[#EEEEEE] box-border transform transition-all duration-100 t hover:-translate-y-0.5 hover:bg-[#DDD] active:bg-[#EEEEEE] p-4 rounded-[5px]'>
                            <div className='relative h-[260px] w-auto bg-[#656565] flex items-center justify-center'>
                                <img src="/src/assets/Image/sample_bundle_art.jpg" alt="cover-art" className='w-auto h-full fill-contain'/>

                                <div className='absolute top-3 left-3 bg-[#841818] px-2 flex items-center justify-center'>
                                    <span className='text-[14px] text-[#FFF]'>Hip-Hop</span>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center w-full pt-2'>
                                <span className='font-bold text-[#141414] text-[18px]'>Title</span>
                                <span className='text-[#656565] text-[16px]'>30 Beat Tapes</span>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center border border-[#DDDDDD] bg-[#EEEEEE] box-border transform transition-all duration-100 t hover:-translate-y-0.5 hover:bg-[#DDD] active:bg-[#EEEEEE] p-4 rounded-[5px]'>
                            <div className='relative h-[260px] w-auto bg-[#656565] flex items-center justify-center'>
                                <img src="/src/assets/Image/sample_bundle_art.jpg" alt="cover-art" className='w-auto h-full fill-contain'/>

                                <div className='absolute top-3 left-3 bg-[#841818] px-2 flex items-center justify-center'>
                                    <span className='text-[14px] text-[#FFF]'>Hip-Hop</span>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center w-full pt-2'>
                                <span className='font-bold text-[#141414] text-[18px]'>Title</span>
                                <span className='text-[#656565] text-[16px]'>30 Beat Tapes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default AllMusic