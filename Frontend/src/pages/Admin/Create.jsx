import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'

import { AudioPeakExtract } from '../../../util/AudioPeakExtract.js'
import { useGenre } from '../../../Hooks/GenreHook'
import { useLicense } from '../../../Hooks/LicenseHook.js'
import { useMutation } from '@tanstack/react-query'

const Create = () => {
    const base_url = 'http://localhost:5000';

    const [isTypeSelected, setIsTypeSelected] = useState('');
    const [licenseSelected, setLicenseSelected] = useState(null);

    // States for Audio preview
    const [untaggedAudioBlob,setUntaggedAudioBlob] = useState(null);
    const [untaggedAudioName, setUntaggedAudioName] = useState('');
    const [untaggedAudioPreview, setUntaggedAudioPreview] = useState(null);

    const [taggedAudioBlob, setTaggedAudioBlob] = useState(null);
    const [taggedAudioName, setTaggedAudioName] = useState('');
    const [taggedAudioPreview, setTaggedAudioPreview] = useState('');

    const [coverArt, setCoverArt] = useState(null);
    const [coverArtBlob, setCoverArtBlob] = useState(null);

    // States for input values --> title, Key, BPM
    const [title, setTitle] = useState('');
    const [bpm, setBpm] = useState('');
    const [key, setKey] = useState('');

    const audioRef = useRef(null);
    const [duration, setDuration] = useState(null);

    const handlePreviewTaggedAudio = (e) => {
        const audioFile = e.target.files[0];
        if (!audioFile) return;

        const reader = new FileReader();
        reader.onload = () => {
            setTaggedAudioPreview(reader.result);
        }

        reader.readAsDataURL(audioFile);
        setTaggedAudioBlob(audioFile);
        setTaggedAudioName(audioFile.name);

        console.log('asdasd')
    };

    const handlePreviewUntaggedAudio = (e) => {
        const audioFile = e.target.files[0];
        if (!audioFile) return;

        const reader = new FileReader();
        reader.onload = () => {
            setUntaggedAudioPreview(reader.result);
        }

        reader.readAsDataURL(audioFile);
        setUntaggedAudioBlob(audioFile);
        setUntaggedAudioName(audioFile.name); 

        
    };


    // get the duration of the audio
    const getDuration = () => {
        const audio = audioRef.current;

        const audioDuration = Math.floor(audio.duration);
        setDuration(audioDuration);

        console.log('Audio Duration: ', audioDuration);
        console.log('Audio actual duration: ', audio.duration);
    }

    
    // IMAGE PREVIEW COVER ART
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


    const { data: genres = [] } = useGenre();
    const { data: license = [] } = useLicense();

    const [selectedGenres, setSelectedGenres] = useState([]);
    const HandleGenreChange = (e) => {
        const value = Number(e.target.value);
        const checked = e.target.checked;
        
        setSelectedGenres((prev) => 
            checked 
                ? [...prev, value] 
                : prev.filter((genre) => genre !== value)
        );

        console.log('selected value: ', value);
    };
    
    useEffect(() => {
        console.log('Genres: ', selectedGenres);
        console.log('License: ', licenseSelected);
    }, [selectedGenres, licenseSelected]);

    // uploading the data
    const handleUpload = (e) => {
        // TODO: find a way to upload three files at the same time
        e.preventDefault();

        
        const audioForm = new FormData();

        audioForm.append('title', title);
        audioForm.append('untagged', untaggedAudioBlob);
        audioForm.append('tagged', taggedAudioBlob);
        audioForm.append('cover_art', coverArtBlob);
        audioForm.append('audio_key', key);
        audioForm.append('bpm', bpm);
        audioForm.append('duration', duration);
        audioForm.append('license_id', licenseSelected);
        console.log('Sent license: ', licenseSelected);
        selectedGenres.forEach(genre_id => {
            audioForm.append('genre_id[]', genre_id);
            console.log('Sending: ', genre_id)
        });
        
        trackUpload(audioForm);
    };


    const { mutate: trackUpload } = useMutation({
        mutationFn: async (FormData) => {
            try {
                const response = await axios.post(`${base_url}/audio/upload-single`, FormData , {
                    withCredentials: true
                });
    
                return response.data
            } catch (err) {
                console.log('Error uploading audio: ', err)
            }
        }, onSuccess: () => {
            setTitle('');
            setUntaggedAudioBlob(null);
            setUntaggedAudioName('');
            setUntaggedAudioPreview(null);
            setTaggedAudioBlob(null);
            setTaggedAudioName('');
            setTaggedAudioPreview(null);
            setCoverArt(null);
            setCoverArtBlob(null);
            setBpm('');
            setKey('');
            setDuration(null);
            setSelectedGenres([]);
            setLicenseSelected(null);

            alert(`You have successfully uploaded the audio title '${title}. Congratulations!'`);
        }
    });

    return (
        <>
            <div className='relative flex flex-col min-h-screen w-full bg-[#FFF] '>
                <TopNav />
            
                <div className='relative grid grid-cols-[15%_85%] w-full bg-[#FFF]'>
                    <SideNav /> 

                    <div className='flex flex-col justify-start w-full p-5 px-[12rem] bg-[#FFF]'>
                        <div className='flex flex-col items-start justify-between w-full gap-3'>
                            <span className='text-[36px] font-bold'>Create</span>
                            <div className={`flex items-center w-fit ${!isTypeSelected ? "border-dashed border-2 border-[#CCC] rounded-[5px]" : ""}`}>
                                <label htmlFor="Single" className={`${isTypeSelected === 'Single' ? 'border-b-4 border-b-[#007F80] text-[#007F80]' : ''} active:bg-[#FFF] hover:bg-[#EEE] font-bold p-2 px-4 cursor-pointer whitespace-nowrap`} >
                                    Single
                                    <input type="radio" name="type" id="Single" value={'Single'} hidden onChange={(e) => setIsTypeSelected(e.target.value)}/>
                                </label>

                                <label htmlFor="Beat_Tape" className={`${isTypeSelected === 'Beat_Tape' ? 'border-b-4 border-b-[#007F80] text-[#007F80]' : ''} hover:bg-[#EEE] active:bg-[#FFF]  p-2 px-4 font-bold cursor-pointer whitespace-nowrap`}>
                                    Beat Tape
                                    <input type="radio" name="type" id="Beat_Tape" value={'Beat_Tape'} onChange={(e) => setIsTypeSelected(e.target.value)} hidden/>
                                </label>

                                {!isTypeSelected && (
                                    <>
                                        <span>|</span>
                                        <span className='px-4  text-[14px] font-bold text-[#005F60]'>Select a type to create</span>
                                    </>
                                )}
                            </div>

                            {isTypeSelected === 'Single' && (
                                <form onSubmit={handleUpload} className='flex flex-col py-5 w-[700px] items-start justify-start gap-5'>
                                    <div className='flex flex-col w-full'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Title</span>
                                        <input type="text" placeholder='Add a title' 
                                            value={title} onChange={(e) => setTitle(e.target.value)}
                                            className='w-full rounded-[5px] p-2 border border-[#CCC] focus:border-[#141414] focus:outline-none'
                                        />
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <div className='flex items-center w-full justify-between'>
                                            <span className='font-bold text-[#1E1E1E] opacity-50'>Upload Preview Audio (with Producer Tag)</span>
                                            
                                        </div>
                                        <div className='flex items-center justify-center w-full min-h-[75px] border-2 border-dashed border-[#CCC] rounded-[5px]'>
                                            {!taggedAudioPreview ? (
                                                <label htmlFor='single' className='flex w-full h-full items-center justify-center hover:bg-[#DDD] cursor-pointer active:bg-[#FFF]'>
                                                    <span>Choose audio preview +</span>  
                                                    <input onChange={handlePreviewTaggedAudio} type="file" name="singleUpload" id="single" hidden accept='audio/mp3' />
                                                </label>
                                            ) : (
                                                <div className='flex flex-col items-center w-full gap-2 p-2'>
                                                    <span>{taggedAudioName}</span>
                                                    <audio className='flex w-full' src={taggedAudioPreview} controls/>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Upload Downloadable Audio (No Tag/ Clean version)</span>
                                        <div className='flex items-center justify-center w-full min-h-[75px] border-2 border-dashed border-[#CCC] rounded-[5px]'>
                                            {!untaggedAudioPreview ? (
                                                <label htmlFor='beatTape' className='flex w-full h-full items-center justify-center hover:bg-[#DDD] cursor-pointer active:bg-[#FFF]'>
                                                    Choose audio +  
                                                    <input onChange={handlePreviewUntaggedAudio} type="file" name="beatTapeUpload" id="beatTape" hidden accept='audio/*' />
                                                </label>
                                            ) : (
                                                <div className='flex flex-col gap-1 items-center p-2 w-full'>
                                                    <span>{untaggedAudioName}</span>
                                                    <audio ref={audioRef} onLoadedMetadata={getDuration} className='flex w-full' src={untaggedAudioPreview} controls/>
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Upload Cover Art (Must be 1:1 Ratio)</span>
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

                                    <div className='flex items-center w-full gap-2'>
                                        <div className='flex flex-col w-full'>
                                            <span className='font-bold text-[#1E1E1E] opacity-50'>Key</span>
                                            <input type="text" placeholder="Add key like 'A min'..."
                                                value={key} onChange={(e) => setKey(e.target.value)}
                                                className='w-full rounded-[5px] p-2 border border-[#CCC] focus:border-[#141414] focus:outline-none'
                                            />
                                        </div>

                                        <div className='flex flex-col w-full'>
                                            <span className='font-bold text-[#1E1E1E] opacity-50'>BPM</span>
                                            <input type="text" placeholder="Enter BPM" 
                                                value={bpm} onChange={(e) => setBpm(e.target.value)}
                                                className='w-full rounded-[5px] p-2 border border-[#CCC] focus:border-[#141414] focus:outline-none'
                                            />
                                        </div>
                                    </div>

                                    <div className='flex flex-col w-full items-start justify-center'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Select a genre for this track (You select all that applies)</span>
                                        <div className='flex w-full gap-1 items-center justify-start p-2 border-dashed border-2 border-[#CCC] rounded-[5px]'>
                                            {genres.map((genre) => (
                                                <label key={genre.id} htmlFor={`genre_${genre.id}`} className={`${selectedGenres.includes(genre.id) && 'bg-[#03f8c5]'} px-2 py-0.5 rounded-[5px] border border-[#1E1E1E] cursor-pointer`}>
                                                    {genre.name}
                                                    <input type="checkbox" name="genre_group" id={`genre_${genre.id}`} value={genre.id} onChange={HandleGenreChange} hidden/>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='flex flex-col w-full gap-2'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Select a license for this track</span>
                                        {license.map((lic) => (
                                            <div key={lic.id} className='flex'>
                                                <label htmlFor={`license_${lic.license}`} className={`${licenseSelected === lic.id ? 'bg-[#EADCA7]' : 'bg-[#EEE]'} flex w-full items-center justify-between p-2 border border-[#BBB] rounded-[5px] gap-2 cursor-pointer`}>
                                                    <div className='flex items-center'>
                                                        <input onChange={() => setLicenseSelected(lic.id)} value={lic.id} type="radio" name="license" id={`license_${lic.license}`} hidden/>
                                                        <span>{lic.license}</span> 
                                                    </div> 

                                                    <a href={lic.document_url} target='_blank' className='flex hover:underline opacity-50 hover:opacity-100 active:opacity-50'>View document</a>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    

                                    <div className='flex items-center gap-1 w-full justify-end'>
                                        <button className='px-4 py-1 bg-[#03f8c5] border border-[#007F80] rounded-[5px] hover:opacity-50 active:opacity-100'>Upload</button>

                                        <button className='px-4 py-1 border border-[#141414] rounded-[5px] hover:opacity-50 active:opacity-100'>Cancel</button>
                                    </div>
                                </form>
                            )}

                            {isTypeSelected === 'Beat Tape' && (
                                <div>
                                    Beat Tape
                                </div>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Create