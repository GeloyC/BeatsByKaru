import React, { useEffect, useState, useRef } from 'react'
import { useLicense } from '../../../Hooks/LicenseHook.js'
import UnpublishedTracks from './UnpublishedTracks.jsx';
import { useAudio, selectedTrackSingle } from '../../../Hooks/AudioHooks.js';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';


const CreateSingle = ({ isTrackListOpen, audio_id }) => {
    
    const [coverArt, setCoverArt] = useState(null);
    const [coverArtBlob, setCoverArtBlob] = useState(null);
    const [licenseSelected, setLicenseSelected] = useState(null);
    const [price, setPrice] = useState(0);

    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    // States for opening and closing windows
    const [openTrackList, setOpenTrackList] = useState(false);

    const { data: license = [] } = useLicense();
    const { data: audios = [] } = useAudio();
    
    
    const handlePreviewCoverArt = (e) => {
        const imageFile = e.target.files[0];
        if (!imageFile) return;

        const reader = new FileReader();

        reader.onload = () => {
            setCoverArt(reader.result)
        }
        reader.readAsDataURL(imageFile)
        setCoverArtBlob(imageFile);
    }


    const getSingleData = async (id) => {
        const data = await selectedTrackSingle(id);
        if (!data ) {
            throw new Error('Data is empty or null.');
        }

        setSelectedTrack(data);
        setOpenTrackList(false);
    }


    const playAudio = () => {
        const audio = audioRef.current;
        if (audio.paused) {
            audio.play();
            setPlaying(true);
        } else {
            audio.pause();
            setPlaying(false);
        }
    }

    const handleUpdateTrackReleaseNow = (e) => {
        e.preventDefault();

        const trackReleaseForm = new FormData();

        trackReleaseForm.append('license_id', licenseSelected);
        trackReleaseForm.append('price', price);
        trackReleaseForm.append('date_updated', new Date(Date.now()).toLocaleDateString());
        trackReleaseForm.append('cover_art', coverArtBlob);


        updateSingleReleaseNow(trackReleaseForm);
    }

    const { mutate: updateSingleReleaseNow } = useMutation({
        mutationFn: async (formData) => {
            try {
                const response = await axios.patch(`http://localhost:5000/audio/single/${selectedTrackId}/release`, formData, {
                    withCredentials: true
                });
    
                console.log('Patch result: ', response.data);
                return response.data;
            } catch(err) {
                console.error('Failed to update single: ', err);
            }
        },
        onSuccess: () => {
            setOpenTrackList(false);
            licenseSelected(null);
            setPrice(0);
            setSelectedTrackId(null);
            setSelectedTrack(null);
        }
    });


    return (
        <div className='grid grid-cols-2 w-full'>
            <div className='flex flex-col w-full gap-5'>
                <div className='flex flex-col items-start w-full'>
                    <span className='font-bold text-[#1E1E1E] opacity-75'>Select track</span>
                    {selectedTrack && !openTrackList ? (
                        <div className='flex w-full items-center justify-start gap-2 border-2 border-[#007F80] p-2 rounded-[5px] bg-[#03f8c5]'>
                            <div className='flex w-full items-center justify-start gap-2'>
                                <button onClick={playAudio} className='w-[30px] h-[30px]'>
                                    {playing ? (
                                        <img src="/src/assets/icons/pause_black.png" alt="pause" />
                                    ) : (
                                        <img src="/src/assets/icons/play_black.png" alt="play" />
                                    )}
                                </button>
                                <span className='font-bold text-[#141414]'>{selectedTrack.title}</span>
                                <audio ref={audioRef} src={selectedTrack.audio_tagged_url} controls hidden></audio>
                            </div>
                            <button onClick={() => setOpenTrackList(true)} className='whitespace-nowrap opacity-50 hover:opacity-100 hover:font-bold active:opacity-50'>Choose another</button>
                        </div>
                    ) : (
                        <button onClick={() => setOpenTrackList(true)} className={`flex items-center justify-center font-bold w-full p-2 rounded-[10px] border border-[#2A2A2A]  transition-all duration-100 ${!openTrackList ? 'disabled hover:bg-[#EEE] active:border-[#BABABA] active:bg-[#FFF]' : 'opacity-25'}`}>
                            +
                        </button>
                    )}
                </div>

                <div className='flex flex-col w-full gap-2'>
                    <span className='font-bold text-[#1E1E1E] opacity-50'>Select a license for this track</span>
                    {license.map((lic) => (
                        <div key={lic.id} className='flex'>
                            <label htmlFor={`license_${lic.license}`} className={`${licenseSelected === lic.id ? 'bg-[#EADCA7]' : 'bg-[#EEE]'} flex w-full items-center justify-between p-2 border border-[#BBB] rounded-[5px] gap-2 cursor-pointer hover:border-[#2A2A2A]`}>
                                <div className='flex items-center'>
                                    <input onChange={() => setLicenseSelected(lic.id)} value={lic.id} type="radio" name="license" id={`license_${lic.license}`} hidden/>
                                    <span>{lic.license}</span> 
                                </div> 

                                <a href={lic.document_url} target='_blank' className='flex hover:underline opacity-50 hover:opacity-100 active:opacity-50'>View document</a>
                            </label>
                        </div>
                    ))}
                </div>

                <div className='flex flex-col w-full gap-2'>
                    <span className='font-bold text-[#1E1E1E] opacity-75'>Upload Cover Art (1080x1080)</span>
                    {!coverArt ? (
                        <label htmlFor="cover_art" className='cursor-pointer w-full flex items-center justify-center border-dashed border-2 border-[#CCC] py-5 rounded-[5px] hover:bg-[#EEE] active:bg-[#FFF]'>
                            <img src="/src/assets/icons/image.png" alt="image logo" className='size-12' />
                            <input onChange={handlePreviewCoverArt} type="file" id="cover_art" accept='image/png, image/jpeg' hidden/>
                        </label>
                    ) : (
                        <div className='flex items-center justify-center w-full p-2'>
                            <div className='relative flex items-start justify-start w-[300px] h-[300px] rounded-[5px] overflow-hidden'>
                                <button onClick={() => setCoverArt(null)} className='absolute top-2 right-2 text-[14px] text-[#141414] bg-[#EEE] rounded-[10px] px-3 py-1  active:bg-[#CCC] flex items-center justify-center'>Change Image</button>
                                <img src={coverArt} alt="" className='w-full h-full object-cover'/>
                            </div>
                        </div>
                    )}
                </div>

                <div className='flex flex-col w-full gap-2'>
                    <span className='font-bold text-[#1E1E1E] opacity-75'>Set a price for this track</span>
                    <div className='flex w-full gap-2 items-center'>
                        <span className='font-bold text-[18px]'>₱</span>
                        <input type="text" 
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))} className='flex w-full p-2 border border-[#BABABA] rounded-[5px] focus:border-[#2A2A2A] focus:outline-none'/>
                    </div>
                </div> 

                <div className='flex items-center gap-1 w-full justify-end'>
                    <button className='px-4 py-1 border border-[#6A6A6A] rounded-[5px] hover:opacity-50 active:opacity-100'>Set a Release Date</button>

                    <button onClick={handleUpdateTrackReleaseNow} className='px-4 py-1 bg-[#03f8c5] border border-[#007F80] rounded-[5px] hover:opacity-50 active:opacity-100'>Release Now</button>
                </div>
            </div>
                
            {openTrackList && 
                <UnpublishedTracks 
                    tracks={audios} 
                    onSelectTrack={setSelectedTrackId} 
                    closeTrackList={() => setOpenTrackList(false)}
                    selectTrack={getSingleData}
                    selectedTrackID={selectedTrackId}
                />
            }
        </div>
    )
}

export default CreateSingle