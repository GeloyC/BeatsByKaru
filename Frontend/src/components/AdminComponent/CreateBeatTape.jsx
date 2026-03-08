import React, { useEffect, useState } from 'react'
import UnpublishedTracks from './UnpublishedTracks'
import { useSingleAvailable } from '../../../Hooks/AudioHooks.js';
import { useLicense } from '../../../Hooks/LicenseHook.js'

import axios from 'axios';
import SingleTracks from './SingleTracks.jsx';
import { useMutation } from '@tanstack/react-query';

const CreateBeatTape = ({ isTrackListOpen, audio_id, typeSelected }) => {

    const base_url = import.meta.env.VITE_API_BASE_URL;

    const [selectedTrackId, setSelectedTrackId] = useState([]); // Array so multiple selection is valid
    const [openTrackList, setOpenTrackList] = useState(false);

    const [coverArt, setCoverArt] = useState(null);
    const [coverArtBlob, setCoverArtBlob] = useState(null);

    const [beatTapeSelection, setBeatTapeSelection] = useState([]);
    const [releaseDate, setReleaseDate] = useState('')
    const [beatTapeTitle, setBeatTapeTitle] = useState('');
    const [price, setPrice] = useState('');
    
    // Data
    const { data: singleTracks = [] } = useSingleAvailable();
    const { data: license = [] } = useLicense();

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
    

    const fetchMultipleTrack = async () => {
        for (const track of selectedTrackId ) {
            const { data } = await axios.get(`http://localhost:5000/audio/beat_tape/${track}`);

            setBeatTapeSelection(prev => {
                if (prev.some(track => track.id === data.id)) return prev;
                return [...prev, data]
            })
        }

        setOpenTrackList(false)
    }

    const removeFromTracks = (id) => {
        setBeatTapeSelection(prev => prev.filter(track => track.id !== id)); // removes from the selection
        setSelectedTrackId(prev => prev.filter(track => track !== id)); // removes from the unpublishedTracks selected tracks
    }

    const totalPrice = beatTapeSelection.reduce((sum, track) => sum + track.price, 0);

    const moveTrackOrder = (arr, from, to) => {
        const arrCopy = [...arr];
        const [item] = arrCopy.splice(from, 1);
        arrCopy.splice(to, 0, item);

        return arrCopy;
    }

    const handleTrackOrderChange = (fromIndex, value) => {
        const toIndex = Number(value) - 1;

        if (Number.isNaN(toIndex)) return;

        setBeatTapeSelection(prev => {
            const maxIndex = prev.length - 1;
            const clamped = Math.max(0, Math.min(toIndex, maxIndex));

            if (fromIndex === clamped) return prev;

            return moveTrackOrder(prev, fromIndex, clamped)
        });
    }
    
    const handleUploadBeatTape = () => {
        const beatTapeForm = new FormData();

        beatTapeForm.append('audio_id', JSON.stringify(selectedTrackId));
        beatTapeForm.append('title', beatTapeTitle);
        beatTapeForm.append('cover_art', coverArtBlob);
        beatTapeForm.append('release_date', releaseDate);
        beatTapeForm.append('price', price);

        console.log([...beatTapeForm.entries()]);
        beatTapeUpload(beatTapeForm);
    }

    
    const {mutate: beatTapeUpload} = useMutation({
        mutationKey: ['beat_tape'],
        mutationFn: async (payload) => {
            try {
                const response = await axios.post(`${base_url}/audio/beat_tape/upload`, payload, { withCredentials: true });
                console.log('Beat Tape upload reponse: ', response);
                return response.data;
            } catch(err) {
                console.error('Failed to publish beat_tape: ', err);
            }
        }
    });

    return (
        <div className='grid grid-cols-2 w-full'>
            <div className='flex flex-col w-full gap-5'>
                <div className='flex flex-col items-start w-full gap-2'>
                    <span className='font-bold text-[#1E1E1E] opacity-75'>Select the tracks for your Beat Tape</span>

                    <div className='flex flex-col items-center justify-start w-full p-2 rounded-[10px] border-2 border-dashed border-[#BABABA] gap-1 border-box'>

                        {/* Only display track when clicked select */}
                        {openTrackList === true ||  beatTapeSelection.length <= 0 ? (
                            <button onClick={() => setOpenTrackList(true)} className={`flex items-center justify-center font-bold w-fit p-1 px-3 bg-[#EEE] rounded-full border-2 border-[#2A2A2A] transition-all duration-100 ${!openTrackList ? 'disabled hover:bg-[#BBB] active:border-[#BABABA] active:bg-[#EEE]' : 'opacity-25'}`}>+ Select Tracks</button>
                        ) : (
                            <div className='flex flex-col w-full gap-1'>
                                {beatTapeSelection.length < 0 && (
                                    <div className='grid grid-cols-[10%_90%] w-full place-items-center opacity-75'>
                                        <span className='px-4 text-[14px]'>ORDER</span>
                                        <span className='text-[14px]'>TRACKS</span>
                                    </div>
                                )}

                                {/*
                                    TODO: Make the input dependent relative to its corresponding track
                                 */}

                                {beatTapeSelection.map((beatTape, index) => (
                                    <div key={beatTape.id} className='flex items-center w-full gap-1'>
                                        <input type="text" id={`track_id_${beatTape.id}`} name="track_order" 
                                        min={1}
                                        max={beatTapeSelection.length}
                                        value={index + 1} 
                                        onChange={(e) => handleTrackOrderChange(index, e.target.value)} 
                                        className='w-[40px] p-1 px-2 rounded-[10px] border-2 border-[#BABABA] text-center'/>

                                        <div key={beatTape.id} className='flex items-center justify-between w-full p-1 px-2 rounded-[10px] border-2 border-[#005F60] bg-[#03f8c5]'>
                                            <span>{beatTape.title}</span>
                                            
                                            <button onClick={() => removeFromTracks(beatTape.id)} type='button' className='flex items-center justify-center w-[20px] h-[20px] opacity-50 hover:opacity-100 active:opacity-50'>
                                                <img src="/src/assets/icons/clear.png" alt="clear" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button onClick={() => setOpenTrackList(true)} className='self-center w-fit items-center bg-[#DDD] border border-[#141414] p-1 px-3 rounded-[10px] hover:bg-[#BABABA] active:bg-[#DDD]'>+ Add More</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex flex-col w-full gap-2'>
                    <span className='font-bold text-[#1E1E1E]/75'>Beat Tape Title</span>
                    <input type="text" id="beat_tape_title" placeholder='Enter the title for this Beat Tape here...' value={beatTapeTitle} onChange={(e) => setBeatTapeTitle(e.target.value)}
                    className='flex w-full p-2 border border-[#BABABA] rounded-[5px] focus:border-[#2A2A2A] focus:outline-none'/>
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
                    <span className='font-bold text-[#1E1E1E] opacity-75'>Price</span>

                    <input type="text" placeholder={`Set a price for "${beatTapeTitle || '[Beat Tape Title]'}"`}
                    value={price} onChange={(e) => setPrice(e.target.value)}
                    className='flex w-full p-2 border border-[#BABABA] rounded-[5px] focus:border-[#2A2A2A] focus:outline-none'/>
                </div>  

                <div className='flex flex-col w-full gap-2'>
                    <span className='font-bold text-[#1E1E1E] opacity-75'>Set a release date</span>
                    <div className='flex w-full gap-2 items-center'>
                        <input type="date" id='release_date' name='release_date' 
                        min={new Date().toISOString().split('T')[0]}
                        value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)}
                        className='flex w-full p-2 border border-[#BABABA] rounded-[5px] focus:border-[#2A2A2A] focus:outline-none' />
                    </div>
                </div>

                <div className='flex items-center gap-1 w-full justify-end'>
                    <button onClick={handleUploadBeatTape} className='px-4 py-1 bg-[#03f8c5] border border-[#007F80] rounded-[5px] hover:opacity-50 active:opacity-100'>Save changes</button>
                </div>
            </div>

            {openTrackList && (
                <SingleTracks 
                    tracks={singleTracks}
                    selectedTrackID={selectedTrackId}
                    onSelectTrack={setSelectedTrackId}
                    fetchTracks={fetchMultipleTrack}
                />
            )}

        </div>
    )
}

export default CreateBeatTape