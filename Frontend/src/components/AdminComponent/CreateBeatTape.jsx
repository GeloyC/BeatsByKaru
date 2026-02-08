import React, { useState } from 'react'
import UnpublishedTracks from './UnpublishedTracks'
import { useAudio } from '../../../Hooks/AudioHooks';

const CreateBeatTape = ({ isTrackListOpen, audio_id }) => {

    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [openTrackList, setOpenTrackList] = useState(false);

    // Data
    const { data: audios = [] } = useAudio();

    return (
        <div className='grid grid-cols-2 w-full'>
            <div className='flex flex-col w-full gap-5'>
                <div className='flex flex-col items-start w-full gap-2'>
                    <span className='font-bold text-[#1E1E1E] opacity-75'>Select the tracks for your Beat Tape</span>
                    <button onClick={() => setOpenTrackList(true)} className={`flex items-center justify-center font-bold w-full p-2 rounded-[10px] border border-[#2A2A2A]  transition-all duration-100 ${!openTrackList ? 'disabled hover:bg-[#EEE] active:border-[#BABABA] active:bg-[#FFF]' : 'opacity-25'}`}>Select Multiple Tracks</button>

                    <div className='flex flex-col items-start justify-start w-full p-2 border-2 border-dashed border-[#BABABA] rounded-[10px] gap-1'>
                        <div className='flex items-center justify-between w-full p-1 px-2 rounded-[10px] border-2 border-[#005F60] bg-[#03f8c5]'>
                            <div>
                                Track details here
                            </div>
                            
                            <button type='button' className='flex items-center justify-center w-[20px] h-[20px] opacity-50 hover:opacity-100 active:opacity-50'>
                                <img src="/src/assets/icons/clear.png" alt="clear" />
                            </button>
                        </div>

                        <div className='flex items-start justify-between w-full p-1 px-2 rounded-[10px] border-2 border-[#005F60] bg-[#03f8c5]'>
                            <div>
                                Track details here
                            </div>
                            
                            <button type='button' className='flex items-center justify-center w-[20px] h-[20px] opacity-50 hover:opacity-100 active:opacity-50'>
                                <img src="/src/assets/icons/clear.png" alt="clear" />
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>

            {openTrackList && (
                <UnpublishedTracks 
                    tracks={audios} 
                    onSelectTrack={setSelectedTrackId} 
                    closeTrackList={() => setOpenTrackList(false)}
                />
            )}
        </div>
    )
}

export default CreateBeatTape