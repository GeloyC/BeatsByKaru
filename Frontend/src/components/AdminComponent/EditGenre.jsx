import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

const EditGenre = ({ genre_id, onClose }) => {
    const base_url = 'http://localhost:5000'

    return (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-[600px] h-auto py-4 px-5 border border-[#BBB] rounded-[10px] gap-4 bg-[#FFF]'>
            
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
                    <input type="text" placeholder='Change genre name here...' 
                    className='px-3 py-1 rounded-[5px] w-full border-[#CCC] focus:border-[#2A2A2A] border focus:outline-none'/>
                </div>

                <div className='flex flex-col w-full gap-2'>
                    <span>Image</span>
                    <label htmlFor="genreImage">
                        <input type="file" id="genreImage" accept='image/jpeg, image/png'/>
                    </label>
                </div>
            </div>

            <div className='flex w-full items-center justify-end gap-1'>
                <button type='button' className='px-3 py-1 bg-[#03f8c5] rounded-[5px] hover:bg-[#EADCA7] active:bg-[#03f8c5]'>Save Changes</button>
                <Link to={'/manage'} type='button' className='px-3 py-1 bg-[#EEE] rounded-[5px] hover:bg-[#CCC] active:bg-[#EEE]'>Cancel</Link>
            </div>
        </div>
    )
}

export default EditGenre