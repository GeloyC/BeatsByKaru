import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const AddGenre = ({ closeAddGenreWindow }) => {
    const base_url = `http://localhost:5000`;
    const queryClient = useQueryClient();


    const [genreName, setGenreName] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [imageBlob, setImageBlob] = useState(null);
    const [sucessMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    
    const handleImagePreivew = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        }
        
        reader.readAsDataURL(file);


        setImageBlob(file);
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!imageBlob || genreName === '') {
            setError("Please provide both genre name and image.");
            return;
        }
        
        const imageForm = new FormData(e.target)

        imageForm.append('name', genreName);
        imageForm.append('cover_art', imageBlob);

        console.log('Name: ', genreName);
        console.log('File: ', imageBlob);

        createGenre.mutate(imageForm);    
        closeAddGenreWindow();
    }

    const resetGenre = () => {
        setGenreName('');
        setImagePreview('');
        closeAddGenreWindow();
    }


    const createGenre = useMutation({
        mutationFn: async (formData) => {
            try {
                const response = await axios.post(`${base_url}/genre/new`,formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                })
                
                console.log(response.data)
                return response.data
            } catch (err) {
                console.error('Error uploading file: ', err);
            }
        },
        onSuccess: (data) => {
            setGenreName('');
            setImagePreview('');
            setSuccessMessage('New Genre created successfully!');
            console.log("File URL:", data.cover_art_url);

            // Immediate trigger the queryKey to display changes 
            queryClient.invalidateQueries(['genre']);
        }, 
        onError: (err) => {
            console.log('Error uploading file ', err);
        }
    });


    



    return (
        <div className='flex flex-col items-start justify-start w-[800px] overflow-x-hidden overflow-y-scroll scrollbar-thin p-5 border-l border-l-[#DDD] gap-5'>
            <div className='flex items-center justify-between w-full border-b border-b-[#CCC] pb-2'>
                <span className='text-[22px] font-bold '>Add Genre</span>
                <button onClick={closeAddGenreWindow} className='flex items-center bg-[#EADCA7] px-2 py-1 rounded-[5px]'>Close</button>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col justify-between w-full h-full'>
                <div className='flex flex-col w-full gap-5'>
                    <div className='flex items-center w-full gap-2'>
                        <span>Genre</span>
                        <input type="text" placeholder='Name of Genre' value={genreName} onChange={(e) => (
                            setGenreName(e.target.value),
                            setError('')
                        )}
                        className='bg-[#EEE] border border-[#BBB] p-1 px-2 rounded-[5px] w-full focus:border-[#2A2A2A] focus:outline-none'/>
                    </div>

                    <div className='flex flex-col w-full'>
                        <span>Cover Photo</span>
                        <div className={`relative flex items-center justify-center w-full border-dashed border-2 border-[#BBB]  rounded-[5px] ${imagePreview && 'p-2'}`}>
                            

                            {!imagePreview ? (
                                <label htmlFor="genreCover" className='flex items-center justify-center w-full h-full font-bold cursor-pointer p-4 hover:bg-[#EEE] active:bg-[#FFF]'>
                                    Upload
                                    <input onChange={ handleImagePreivew } type="file" id="genreCover" accept='image/jpeg, image/png' hidden />
                                </label>

                            ) : (
                                <>
                                    <button onClick={() => setImagePreview('')} type='button' className='absolute top-3 right-3 size-7 p-2 rounded-full hover:bg-[#DDD] active:bg-[#FFF]'>
                                        <img src="/src/assets/icons/clear_black.png" alt="" />
                                    </button>
                                    <div className='flex items-center justify-center w-[300px] h-[300px] rounded-[10px] overflow-hidden'>

                                        <img src={imagePreview} alt="" className='object-cover w-full h-full'/>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>

                    {sucessMessage && ( <span className='flex w-full justify-center text-[#007F80] font-bold'>{sucessMessage}</span> )}

                    {error && (
                        <span className='flex w-full justify-center text-[14px] text-[#FF0000]'>{error}</span>
                    )}
                    
                </div>

                {!sucessMessage && (
                    <div className='flex w-full items-center justify-end gap-1'>
                        <button className='bg-[#03f8c5] text-[#005F60] px-3 py-1 rounded-[5px] active:bg-[#007F80] cursor-pointer'>Save</button>
                        <button onClick={resetGenre} className='bg-[#EEE] px-2 py-1 rounded-[5px] cursor-pointer active:bg-[#CCC]'>Cancel</button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default AddGenre