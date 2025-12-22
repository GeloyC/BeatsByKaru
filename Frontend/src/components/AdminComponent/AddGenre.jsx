import React, { useEffect, useState } from 'react'

const AddGenre = ({ closeAddGenreWindow }) => {

    const [genreName, setGenreName] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    
    const handleImagePreivew = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        }
        
        reader.readAsDataURL(file);
    }

    const resetGenre = () => {
        setGenreName('');
        setImagePreview('');
        closeAddGenreWindow();
    }

    return (
        <div className='flex flex-col items-start justify-start w-[800px] overflow-x-hidden overflow-y-scroll scrollbar-thin p-5 border-l border-l-[#DDD] gap-5'>
            <div className='flex items-center justify-between w-full border-b border-b-[#CCC] pb-2'>
                <span className='text-[22px] font-bold '>Add Genre</span>
                <button onClick={closeAddGenreWindow} className='flex items-center bg-[#EADCA7] px-2 py-1 rounded-[5px]'>Close</button>
            </div>

            <div className='flex flex-col justify-between w-full h-full'>
                <div className='flex flex-col w-full gap-5'>
                    <div className='flex items-center w-full gap-2'>
                        <span>Genre</span>
                        <input type="text" placeholder='Name of Genre' 
                        value={genreName} onChange={(e) => setGenreName(e.target.value)}
                        className='bg-[#EEE] border border-[#BBB] p-1 px-2 rounded-[5px] w-full focus:border-[#2A2A2A] focus:outline-none'/>
                    </div>

                    <div className='flex flex-col w-full'>
                        <span>Cover Photo</span>
                        <div className='flex items-center justify-center w-full border-dashed border-2 border-[#BBB] p-2 rounded-[5px]'>
                            {!imagePreview ? (
                                <label htmlFor="genreCover" className='font-bold cursor-pointer'>
                                    Upload
                                    <input onChange={handleImagePreivew} type="file" id="genreCover" accept='image/jpeg, image/png' hidden/>
                                </label>

                            ) : (
                                <div className=''>
                                    <img src={imagePreview} alt="" />
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <div className='flex w-full items-center justify-end gap-1'>
                    <button className='bg-[#03f8c5] text-[#005F60] px-3 py-1 rounded-[5px] active:bg-[#007F80] cursor-pointer'>Save</button>
                    <button onClick={resetGenre} className='bg-[#EEE] px-2 py-1 rounded-[5px] cursor-pointer active:bg-[#CCC]'>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AddGenre