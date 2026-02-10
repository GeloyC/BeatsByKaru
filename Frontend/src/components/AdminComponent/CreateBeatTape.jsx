import React, { useState } from 'react'
import UnpublishedTracks from './UnpublishedTracks'
import { useAudio } from '../../../Hooks/AudioHooks';
import { useLicense } from '../../../Hooks/LicenseHook.js'

const CreateBeatTape = ({ isTrackListOpen, audio_id, typeSelected }) => {

    const [selectedTrackId, setSelectedTrackId] = useState([]); // Array so multiple selection is valid
    const [openTrackList, setOpenTrackList] = useState(false);
    const [licenseSelected, setLicenseSelected] = useState(null);
    

    // Data
    const { data: audios = [] } = useAudio();
    const { data: license = [] } = useLicense();

    console.log('Selected track id: ', selectedTrackId, typeof selectedTrackId);

    return (
        <div className='grid grid-cols-2 w-full'>
            <div className='flex flex-col w-full gap-5'>
                <div className='flex flex-col items-start w-full gap-2'>
                    <span className='font-bold text-[#1E1E1E] opacity-75'>Select the tracks for your Beat Tape</span>

                    <div className='flex flex-col items-center justify-start w-full p-2 rounded-[10px] border-2 border-dashed border-[#BABABA] gap-1'>

                        {selectedTrackId.length <= 0 ? (
                            <button onClick={() => setOpenTrackList(true)} className={`flex items-center justify-center font-bold w-fit p-1 px-3 bg-[#EEE] rounded-full border-2 border-[#2A2A2A] transition-all duration-100 ${!openTrackList ? 'disabled hover:bg-[#BBB] active:border-[#BABABA] active:bg-[#EEE]' : 'opacity-25'}`}>+ Select Multiple Tracks</button>
                        ) : (
                            selectedTrackId.map(track => (
                                <div key={track} className='flex items-center justify-between w-full p-1 px-2 rounded-[10px] border-2 border-[#005F60] bg-[#03f8c5]'>
                                    <div>
                                        {track}
                                    </div>
                                    
                                    <button type='button' className='flex items-center justify-center w-[20px] h-[20px] opacity-50 hover:opacity-100 active:opacity-50'>
                                        <img src="/src/assets/icons/clear.png" alt="clear" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>


                <div className='flex flex-col w-full gap-2'>
                    <span className='font-bold text-[#1E1E1E] opacity-75'>Select a license for this track</span>
                    {license.map((lic) => (
                        <div key={lic.id} className='flex'>
                            <label htmlFor={`license_${lic.license}`} className={`${licenseSelected === lic.id ? 'bg-[#EADCA7] border-[#D4B74B] ' : 'bg-[#EEE] border-[#BBB] hover:border-[#D4B74B]'} flex w-full items-center justify-between p-2 border border-[#BBB] rounded-[5px] gap-2 cursor-pointer`}>
                                <div className='flex items-center'>
                                    <input onChange={() => setLicenseSelected(lic.id)} value={lic.id} type="radio" name="license" id={`license_${lic.license}`} hidden/>
                                    <span>{lic.license}</span> 
                                </div> 

                                <a href={lic.document_url} target='_blank' className='flex hover:underline opacity-50 hover:opacity-100 active:opacity-50'>View document</a>
                            </label>
                        </div>
                    ))}
                </div>
                
            </div>

            {openTrackList && (
                <UnpublishedTracks 
                    tracks={audios} 
                    onSelectTrack={setSelectedTrackId} 
                    closeTrackList={() => setOpenTrackList(false)}
                    selectedTrackID={selectedTrackId}
                    typeSelection={typeSelected}
                />
            )}
        </div>
    )
}

export default CreateBeatTape