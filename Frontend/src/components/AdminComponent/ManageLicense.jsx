import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ManageLicense = () => {
    const base_url = 'http://localhost:5000';
    const queryClient = useQueryClient();

    const [isAddLicenseOpen, setIsAddLicenseOpen] = useState(false);
    const [licenseType, setLicenseType] = useState('');
    const [licenseBlob, setLicenseBlob] = useState(null);

    const [fileName, setFileName] = useState('');


    const handleFileChange = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        if (!file) return;

        console.log(file);

        setLicenseBlob(file); 
        console.log(file.name);
        setFileName(file.name);
    }



    return (
        <section className='flex flex-col w-full gap-4'>
            <div className='flex items-center justify-between w-full border-b border-b-[#CCC] pb-2'>
                <span className='text-[#005F60] text-[18px] font-bold'>License Type</span>
                <button onClick={() => setIsAddLicenseOpen(true)} className='flex items-center gap-2 font-bold px-3 py-1 rounded-[5px] bg-[#03f8c5] text-[#005F60] hover:opacity-75 active:opacity-100'>
                    + Add License
                </button>
            </div>

            <div className='flex flex-col w-full gap-2 items-start justify-center'>
                <a className='flex w-full items-center gap-2 p-2 px-4 cursor-pointer bg-[#EADCA7] rounded-[10px] hover:opacity-75 active:opacity-100'>
                    <span className='font-bold'>License Name</span>
                    <span className='opacity-50'>file name</span>
                </a>
                    
                

                {isAddLicenseOpen && (
                <form className='flex items-center w-full gap-2'>
                    <input type="text" placeholder='Enter a name for the license type' className='w-full px-3 py-2 rounded-[5px] border border-[#CCC] focus:border-[#2A2A2A] focus:outline-none'
                    value={licenseType} onChange={(e) => setLicenseType(e.target.value)}/>

                    <div className='flex items-center gap-2'>
                        { fileName ? (
                            <div className='flex items-center gap-2 pl-4 border-[#BBB] border rounded-[5px] bg-[#EEE]'>
                                <span className='truncate max-w-[300px]'>{fileName}</span>
                                <button type='button' onClick={() => setFileName('')} className='px-3 py-2 font-bold rounded-[5px] hover:bg-[#CCC] active:bg-[#EEE] cursor-pointer'>Change</button>
                            </div>
                        ) : (
                            <label htmlFor="file" className='flex items-center gap-2 text-[16px] font-bold border-[#BBB] border rounded-[5px] px-3 py-2 bg-[#EEE] hover:bg-[#CCC] active:bg-[#EEE] cursor-pointer'>
                                <img src="/src/assets/icons/file-upload.png" alt="upload file" className='size-6 shrink-0'/>
                                <span className='whitespace-nowrap'>Attach document</span>
                                <input type="file" onChange= {handleFileChange} id="file" accept='application/pdf' hidden/>
                            </label>
                        )}

                    </div>

                    <div className='flex items-center w-fit gap-1'>
                        <button className='px-3 py-2 bg-[#03f8c5] rounded-[5px] border border-[#BBB] hover:opacity-75 active:opacity-100'>Save</button>
                        <button onClick={() => setIsAddLicenseOpen(false)} className='px-3 py-2 bg-[#EADCA7] rounded-[5px] border border-[#BBB] hover:opacity-75 active:opacity-100'>Cancel</button>
                    </div>
                </form>
                )}

            </div>
        </section>
    )
}

export default ManageLicense