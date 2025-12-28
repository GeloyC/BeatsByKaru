import React, { useState, useEffect, useRef } from 'react'
import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'

import WaveformVisual from '../../components/WaveformVisual'
import { useGenre } from '../../../Hooks/GenreHook'

const Create = () => {
    const [isTypeSelected, setIsTypeSelected] = useState('');

    const [audioTaggedURL, setAudioTaggedURL] = useState(null);
    const [audioTaggedFile, setAudioTaggedFile] = useState(null);
    const [audioTaggedName, setAudioTaggedName] = useState('');

    const [audioUntaggedFile, setAudioUntaggedFile] = useState(null)
    const [audioUntaggedURL, setAudioUntaggedURL] = useState(null)
    const [audioUntaggedName, setAudioUntaggedName] = useState('');

    const [coverArt, setCoverArt] = useState(null);

    const audioTaggedInputRef = useRef(null);
    const audioUntaggedInputRef = useRef(null);
    const coverArtInputRef = useRef(null);

    // reference for waveform visual
    const audioTaggedRef = useRef(null);
    const audioUntaggedRef = useRef(null);


    // AUDIO PREVIEW FOR TAGGED AND UNTAGGED
    const handleAudioTagged = (e) => {
        const audioFile = e.target.files[0];
        if (!audioFile) return;


        setAudioTaggedFile(audioFile)
        setAudioTaggedURL(URL.createObjectURL(audioFile))
        setAudioTaggedName(audioFile.name)
    }

    const handleAudioUntagged = (e) => {
        const audioTaggedFile = e.target.files[0];
        if (!audioTaggedFile) return;

        setAudioUntaggedFile(audioTaggedFile);
        setAudioUntaggedURL(URL.createObjectURL(audioTaggedFile));
        setAudioUntaggedName(audioTaggedFile.name)
    }

    const resetTaggedAudio = () => {
        setAudioTaggedFile(null);
        setAudioTaggedURL(null);
        setAudioTaggedName('');
        audioTaggedInputRef.current.value = '';
    }

    const resetUntaggedAudio = () => {
        setAudioUntaggedFile(null);
        setAudioUntaggedURL(null);
        setAudioUntaggedName('');
        audioUntaggedInputRef.current.value = '';
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
    }

    const resetCoverArtPreview = () => {
        setCoverArt(null)
    }

    useEffect(() => {
        return () => {
            audioTaggedURL && URL.revokeObjectURL(audioTaggedURL);
            audioUntaggedURL && URL.revokeObjectURL(audioUntaggedURL);
        };
    }, [audioTaggedURL, audioUntaggedURL]);


    const {data: genres = [], isLoading} = useGenre();
    const [selectedGenre, setSelectedGenre] = useState(genres);

    const HandleGenreChange = (e) => {
        const { value, checked } = e.target;
        setSelectedGenre((prev) => 
            checked ? [...prev, value] : prev.filter((genre) => genre !== value)
        );

        console.log('Current: ', value, checked);
        console.log(selectedGenre);
    };



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
                                <div className='flex flex-col py-5 w-[700px] items-start justify-start gap-5'>
                                    <div className='flex flex-col w-full'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Title</span>
                                        <input type="text" placeholder='Add a title' className='w-full rounded-[5px] p-2 border border-[#CCC] focus:border-[#141414] focus:outline-none'/>
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <div className='flex items-center w-full justify-between'>
                                            <span className='font-bold text-[#1E1E1E] opacity-50'>Upload Preview Audio (with Producer Tag)</span>
                                            
                                        </div>
                                        <div className='flex items-center justify-center w-full h-[100px] border-2 border-dashed border-[#CCC] rounded-[5px]'>
                                            {/* {taggedPrevDisplay && (
                                                
                                            )} */}
                                            {!audioTaggedURL ? (
                                                <label htmlFor='single' className='p-1 px-3 hover:bg-[#DDD] rounded-[10px] cursor-pointer active:bg-[#FFF]'>
                                                    Choose audio preview +  
                                                    <input ref={audioTaggedInputRef} onChange={handleAudioTagged} type="file" name="singleUpload" id="single" hidden accept='audio/mp3' />
                                                </label>
                                            ) : (
                                                <div className='flex flex-col justify-center items-center w-full p-4 gap-2'>
                                                    <div className='flex items-center w-full justify-between'>
                                                        <span className='text-[14px] font-bold'>{audioTaggedName}</span>
                                                        <button onClick={resetTaggedAudio} className='p-2 rounded-full hover:bg-[#EEE] active:bg-[#CCC]'>
                                                            <img src="/src/assets/icons/clear_black.png" alt="" className='size-3'/>
                                                        </button>
                                                    </div>
                                                    <WaveformVisual audio={audioTaggedURL} />
                                                </div>
                                            )}


                                        </div>
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Upload Downloadable Audio (No Tag/ Clean version)</span>
                                        <div className='flex items-center justify-center w-full h-[100px] border-2 border-dashed border-[#CCC] rounded-[5px]'>
                                            {!audioUntaggedURL ? (
                                                <label htmlFor='beatTape' className='p-1 px-3 hover:bg-[#DDD] rounded-[10px] cursor-pointer active:bg-[#FFF]'>
                                                    Choose audio +  
                                                    <input ref={audioUntaggedInputRef} onChange={handleAudioUntagged} type="file" name="beatTapeUpload" id="beatTape" hidden accept='audio/*' />
                                                </label>
                                            ) : (
                                                <div className='flex flex-col justify-center items-center w-full p-4 gap-2'>
                                                    <div className='flex items-center justify-between w-full'>
                                                        <span className='text-[14px] font-bold'>{audioUntaggedName}</span>
                                                        <button onClick={resetUntaggedAudio} className='p-2 rounded-full hover:bg-[#EEE] active:bg-[#CCC]'>
                                                            <img src="/src/assets/icons/clear_black.png" alt="" className='size-3'/>
                                                        </button>
                                                    </div>
                                                    <WaveformVisual audio={audioUntaggedURL} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Key</span>
                                        <input type="text" placeholder="Add key like 'A min'..." className='w-full rounded-[5px] p-2 border border-[#CCC] focus:border-[#141414] focus:outline-none'/>
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>BPM</span>
                                        <input type="text" placeholder="Enter BPM" className='w-full rounded-[5px] p-2 border border-[#CCC] focus:border-[#141414] focus:outline-none'/>
                                    </div>

                                    <div className='flex flex-col w-full items-start justify-center'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Select a genre for this track (You select all that applies)</span>
                                        <div className='flex w-full gap-1 items-center justify-start p-2 border-dashed border-2 border-[#CCC] rounded-[5px]'>
                                            {genres.map((genre) => (
                                                <label key={genre.id} htmlFor={`genre_${genre.name}`} className={`${selectedGenre.includes(genre.name) ? 'bg-[#03f8c5]' : 'bg-[#FFF]'} px-2 py-0.5 rounded-[5px] border border-[#1E1E1E] cursor-pointer`}>
                                                    {genre.name}
                                                    <input type="checkbox" name="genre_group" id={`genre_${genre.name}`} value={genre.name} onChange={HandleGenreChange} hidden/>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <span className='font-bold text-[#1E1E1E] opacity-50'>Upload Cover Art (Must be 1:1 Ratio)</span>
                                        {!coverArt ? (
                                            <label htmlFor="cover_art" className='cursor-pointer w-full flex items-center justify-center border-dashed border-2 border-[#CCC] py-5 rounded-[5px] hover:bg-[#EEE] active:bg-[#FFF]'>
                                                <img src="/src/assets/icons/image.png" alt="image logo" className='size-12' />
                                                <input ref={coverArtInputRef} onChange={handlePreviewCoverArt} type="file" id="cover_art" accept='image/png, image/jpeg' hidden/>
                                            </label>
                                        ) : (
                                            <div className='flex items-center justify-center w-full p-2'>
                                                <div className='relative flex items-start justify-start w-[300px] h-[300px] rounded-[5px] overflow-hidden'>
                                                    <button onClick={resetCoverArtPreview} className='absolute top-2 right-2 text-[14px] text-[#141414] bg-[#EEE] rounded-[10px] px-3 py-1  active:bg-[#CCC] flex items-center justify-center'>Change Image</button>
                                                    <img src={coverArt} alt="" className='w-full h-full object-cover'/>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    <div className='flex items-center gap-1 w-full justify-end'>
                                        <button className='px-4 py-1 bg-[#03f8c5] border border-[#007F80] rounded-[5px] hover:bg-[#EADCA7] active:bg-[#03f8c5]'>Save</button>

                                        <button className='px-4 py-1 border border-[#141414] rounded-[5px] hover:bg-[#CCC] active:bg-[#FFF]'>Cancel</button>
                                    </div>
                                </div>
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