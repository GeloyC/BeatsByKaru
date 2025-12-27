import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const EditGenre = ({ genre_id, onClose }) => {
    const base_url = 'http://localhost:5000';
    const queryClient = useQueryClient();

    const [newGenreName, setNewGenreName] = useState('');
    const [newImagePrev, setNewImagePrev] = useState('');
    const [newImageBlob, setNewImageBlob] = useState(null);
    const [error, setError] = useState('');

    const { data: genre, isLoading } = useQuery({
        queryKey: ['genreview'],
        queryFn: async () => {
            const response = await axios.get(`${base_url}/genre/${genre_id}`, {
                withCredentials: true
            })

            console.log(response.data);
            return response.data
        }
    });

    const handleNewImagePreview = (e) => {
        const image = e.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(image)

        reader.onload = () => {
            setNewImagePrev(reader.result)
        }

        setNewImageBlob(image);

    }

    const handleUploadNewChanges = (e) => {
        e.preventDefault();

        const genreForm = new FormData(e.target);
        genreForm.append('name', newGenreName);
        genreForm.append('newImage', newImageBlob);

        if (newGenreName === genre.name) {
            setError('No changes will be made since the name stayed the same.');
        }

        newGenreChange(genreForm);
    }

    // TODO: Replace image & Save changes
    const { mutate: newGenreChange } = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.patch(`${base_url}/genre/${genre_id}/new`, formData, {
                withCredentials: true
            });

            console.log(response.data);
            setError(response.data.message)
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['genre']);
            // onClose();
        },
        onError: () => {
            console.log(response.message)
            setError('Duplicate');
        }
    })

    return (
        <>
            {genre && (
                <form onSubmit={handleUploadNewChanges} key={genre.id} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-[600px] h-auto py-4 px-5 border border-[#141414] rounded-[10px] gap-4 bg-[#FFF]'>
                    
                    <div className='flex w-full items-center justify-between'>
                        <span className='text-[22px] font-bold'>Edit Genre</span>
                        <button onClick={onClose} className='rounded-full opacity-50 hover:opacity-100 active:opacity-50'>
                            <img src="/src/assets/icons/clear.png" alt="clear" className='size-6' title='Close' />
                        </button>
                    </div>

                    {/* Content */}
                    <div className='flex flex-col w-full justify-center gap-4'>
                        <div className='flex w-full items-center gap-2'>
                            <span>Name</span>
                            <div className='flex flex-col w-full gap-1'>
                                {error && <span className='text-[14px] text-[#FF0000]'>{error}</span>}
                                <input type="text" value={newGenreName || genre.name || ''} onChange={(e) => {setNewGenreName( e.target.value), setError('')}}
                                className='px-3 py-1 rounded-[5px] w-full border-[#CCC] focus:border-[#2A2A2A] border focus:outline-none'/>
                            </div>
                        </div>

                        <div className='flex flex-col w-full gap-2'>
                            <span>Image</span>

                            <div className='flex flex-col w-full items-center justify-center'> 
                                { isLoading ? (
                                    <>
                                        Loading...
                                    </>
                                ) : newImagePrev ? (
                                    <div className='relative flex w-[350px] h-[350px] rounded-[10px] overflow-hidden border-2 border-[#03f8c5] border-dashed'>
                                        <button onClick={() => setNewImagePrev('')} className='absolute top-2 right-2 bg-[#FFF] rounded-full p-0.5'>
                                            <img src="/src/assets/icons/clear.png" alt="clear" className='size-6 opacity-50 hover:opacity-100'/>
                                        </button>
                                        <img src={newImagePrev} alt="image preview" className='object-cover w-full h-full'/>
                                    </div>
                                ) : (
                                    <div className='relative flex w-[350px] h-[350px] rounded-[10px] overflow-hidden items-center justify-center'>
                                        <label htmlFor="genreImage" className='absolute top-2 right-2 self-end w-fit py-1 px-2 items-end justify-end font-bold cursor-pointer text-[14px] bg-[#EEE] rounded-[10px] hover:bg-[#CCC] active:bg-[#FFF]'>
                                            Change Image
                                            <input type="file" onChange={handleNewImagePreview} id="genreImage" accept='image/jpeg, image/png' hidden/>
                                        </label>
                                        <img src={genre.cover_art_url} alt="" className='object-cover w-full h-full'/>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className='flex w-full items-center justify-end gap-1 pt-4'>
                        <button className='px-3 py-1 bg-[#03f8c5] rounded-[5px] hover:bg-[#EADCA7] active:bg-[#03f8c5]'>Save Changes</button>
                        <button onClick={onClose} type='button' className='px-3 py-1 bg-[#EEE] rounded-[5px] hover:bg-[#CCC] active:bg-[#EEE]'>Cancel</button>
                    </div>
                </form>
            )}
        </>
    )
}

export default EditGenre