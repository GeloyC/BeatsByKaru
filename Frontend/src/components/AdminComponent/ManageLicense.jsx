import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const ManageLicense = () => {
    const base_url = 'http://localhost:5000';
    const queryClient = useQueryClient();

    const [isAddLicenseOpen, setIsAddLicenseOpen] = useState(false);
    const [licenseType, setLicenseType] = useState('');
    const [licenseBlob, setLicenseBlob] = useState(null);

    const [fileName, setFileName] = useState('');


    const handleFilePreview = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLicenseBlob(file); 
        console.log(file.name);
        setFileName(file.name);
    }

    const handleFileChange = (e) => {
        e.preventDefault();
        
        const licenseForm = new FormData(e.target);
        licenseForm.append('license', licenseType);
        licenseForm.append('license_file', licenseBlob);

        createLicense(licenseForm);
    }


    const { mutate: createLicense } = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(`${base_url}/license/add`, formData, { withCredentials: true });

            console.log('Result: ', response.data);
            return response.data;
        }, 
        onSuccess: () => {
            console.log('Good shit nice!');
            queryClient.invalidateQueries(['license']);
            setFileName('');
            setLicenseBlob('');
            setIsAddLicenseOpen(false);
        }
    });


    const { data: license = [], isLoading } = useQuery({
        queryKey: ['license'],
        queryFn: async () => {
            const response = await axios.get(`${base_url}/license`, {
                withCredentials: true
            });

            console.log(response.data)
            return response.data;
        }
    });




    return (
        <section className='flex flex-col w-full gap-4'>
            <div className='flex items-center justify-between w-full border-b border-b-[#CCC] pb-2'>
                <span className='text-[#005F60] text-[18px] font-bold'>License Type</span>
                <button onClick={() => setIsAddLicenseOpen(true)} className='flex items-center gap-2 font-bold px-3 py-1 rounded-[5px] bg-[#03f8c5] text-[#005F60] hover:opacity-75 active:opacity-100'>
                    + Add License
                </button>
            </div>

            <div className='flex flex-col w-full gap-2 items-start justify-center'>
                {license.map((lic) => (
                    <div key={lic.id} className='flex items-center justify-between w-full p-2 px-4 rounded-[10px] cursor-pointer bg-[#EADCA7]'>
                        <div className='flex w-full items-center gap-3'>
                            <a href={lic.document_url} target='_blank' className='font-bold hover:underline active:text-[#03f8c5]'>{lic.license}</a>
                            <span className='opacity-25'>|</span>
                            <span className='opacity-50'>{lic.date_created}</span>
                        </div>
                    </div>
                ))}
                    
                

                {isAddLicenseOpen && (
                <form onSubmit={handleFileChange} className='flex items-center w-full gap-2'>
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
                                <input type="file" onChange= {handleFilePreview} id="file" accept='application/pdf' hidden/>
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