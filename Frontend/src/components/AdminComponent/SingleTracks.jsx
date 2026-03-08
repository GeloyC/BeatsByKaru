import React, { useState } from 'react'

import { useAudioPlayer } from '../../../Hooks/useAudioPlayer.js'
import { formatTime } from '../../../helpers/timeFormat.js';

const SingleTracks = ({ tracks, selectedTrackID, onSelectTrack }) => {
  const { refAudio, playingId, toggleAudioPlay} = useAudioPlayer();
  const [singleSelected, setSingleSelected] = useState(false);
  const [singleList, setSingleList] = useState([]);

  // console.log('Track List for Single: ', tracks)

  const handleTrackSelectionChange = (e) => {
      const value = Number(e.target.value);
      const checked = e.target.checked;

      onSelectTrack((prev) => 
          checked
              ? [...prev, value]
              : prev.filter((track_id) => track_id !== value)
      );
  }

  return (
    <div className='flex flex-col items-start gap-2 p-5 w-full'>
        <span className='text-[18px] text-[#141414] font-bold'>Select from published Single</span>

        <div className='flex flex-col items-start justify-start w-full py-2 gap-1'>
          {tracks.map(track => (
            <label key={track.album_id} htmlFor={`single_track_${track.album_id}`} className={`flex items-center justify-between w-full gap-2 p-2 ${selectedTrackID.includes(track.album_id) ? 'border-2 border-[#007F80]/50' : 'border border-[#2A2A2A]/50'} rounded-[5px] `}>
              <input type="checkbox" name="single_tracks" id={`single_track_${track.album_id}`} value={track.album_id} hidden onChange={handleTrackSelectionChange}/>
              <img src={track.cover_art_url} alt="cover-art" className='w-[40px] h-[40px] rounded-[5px]'/>
              <button onClick={() => toggleAudioPlay(track.album_id)} className='w-[30px] h-[30px] opacity-50 hover:opacity-100 active:opacity-50'>
                  {playingId === track.album_id ? (
                      <img src={`/src/assets/icons/${selectedTrackID.includes(track.album_id) ? 'pause_aquamarine' : 'pause_black'}.png`} alt="pause icon" />
                  ) : (
                      <img src={`/src/assets/icons/${selectedTrackID.includes(track.album_id)? 'play_teal' : 'play_black'}.png`} alt="play icon" />
                  )}
              </button>
              <div className='flex items-center justify-between w-full'>
                  <span className={`${selectedTrackID.includes(track.album_id) ? 'text-[#007F80]' : 'text-[#141414]'}`}>{track.title}</span>
                  <audio ref={aud => refAudio.current[track.album_id] = aud } src={track.audio_tagged_url} controls hidden></audio>

                  <span className={`${selectedTrackID.includes(track.album_id) ? 'text-[#007F80]' : 'text-[#141414]'}`}>{formatTime(track.duration)}</span>
              </div>
            </label>  
          ))}
        </div>

        <div className='flex w-full items-center justify-end gap-1'>
            <button className='bg-[#03f8c5] px-4 py-2 rounded-[5px] hover:opacity-75 active:opacity-100'>
                <span className='text-[#141414]'>Continue</span>
            </button>
            <button className='bg-[#BABABA] px-4 py-2 rounded-[5px] hover:opacity-75 active:opacity-100'>
                <span className='text-[#141414]'>Close</span>
            </button>
        </div>
        
    </div>
  )
}

export default SingleTracks