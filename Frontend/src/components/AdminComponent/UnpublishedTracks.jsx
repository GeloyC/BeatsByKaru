import React, { useRef, useState } from 'react';
import { useAudioPlayer } from '../../../Hooks/useAudioPlayer.js'


const UnpublishedTracks = ({ 
    tracks, 
    onSelectTrack, 
    closeTrackList,
    selectTrack, 
    selectedTrackID
}) => {

    const { refAudio, playingId, toggleAudioPlay} = useAudioPlayer();
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    console.log('ID: ', selectedTrackID)

    return (
        <div className='flex flex-col w-full items-start justify-start gap-2 p-5'>
            <span className='font-bold'>Browse all unpublished Tracks</span>

            <div className='flex flex-col w-full h-full px-2 gap-1'>
                {tracks.map(track => (
                    <label key={track.id} htmlFor={`audio_${track.id}`} className={`flex items-center justify-start p-2 w-full border gap-2 rounded-[5px] hover:bg-[#EEE] active:bg-[#FFF] ${selectedTrackID === track.id ? 'border-[#007F80] font-bold text-[#007F80]' : 'border-[#CCC]'}`}>
                        <input hidden onChange={() => {onSelectTrack(track.id)}}
                            checked={selectedTrackID === track.id} type="radio" name={`audio_tracks`} id={`audio_${track.id}`} />
                        <button onClick={() => toggleAudioPlay(track.id)} className='w-[30px] h-[30px] opacity-50 hover:opacity-100 active:opacity-50'>
                            {playingId === track.id ? (
                                <img src="/src/assets/icons/pause_black.png" alt="pause icon" />
                            ) : (
                                <img src={`/src/assets/icons/${selectedTrackID === track.id ? 'play_teal' : 'play_black'}.png`} alt="play icon" />
                            )}
                        </button>
                        <div className='flex items-center justify-between w-full'>
                            <span>{track.title}</span>
                            <audio ref={aud => refAudio.current[track.id] = aud } src={track.audio_tagged_url} controls hidden></audio>

                            <span>{formatTime(track.duration)}</span>
                        </div>
                    </label>
                ))}

                <div className='flex w-full items-end justify-end gap-1 pt-3'>
                    {selectedTrackID && (
                        <button onClick={() => {selectTrack(selectedTrackID); console.log('Click');}} className='bg-[#03f8c5] p-2 rounded-[5px] hover:opacity-75 active:opacity-100'>Select</button>
                    )}
                    <button className='bg-[#BABABA] p-2 rounded-[5px] hover:opacity-75 active:opacity-100' onClick={closeTrackList}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default UnpublishedTracks