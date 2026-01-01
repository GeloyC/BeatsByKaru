import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useLicense } from '../../../Hooks/LicenseHook';


const ManageLicense = () => {
    const base_url = 'http://localhost:5000';
    const queryClient = useQueryClient();

    // Initial states
    const [isAddLicenseOpen, setIsAddLicenseOpen] = useState(false);
    const [licenseType, setLicenseType] = useState('');
    const [licenseBlob, setLicenseBlob] = useState(null);
    const [error, setError] = useState('');

    const [fileName, setFileName] = useState('');
    const [hovered, setHovered] = useState('');


    // States when editing a license
    const [newLicense, setNewLicense] = useState('');
    const [inputOpen, setInputOpen] = useState(false);

    const handleFilePreview = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError('File is empty!');
            return;
        };

        setLicenseBlob(file); 
        URL.createObjectURL(file);
        console.log();
        setFileName(file.name);
    }

    const handleFileChange = (e) => {
        e.preventDefault();
        
        const licenseForm = new FormData(e.target);
        licenseForm.append('license', licenseType);
        licenseForm.append('license_file', licenseBlob);

        if (!licenseType || licenseType === '') {
            setError('Empty license name!');
            return;
        }

        createLicense(licenseForm);
    }

    const cancelFileChange = () => {
        setLicenseBlob(null);
        setLicenseType('');
        setError('');
        setFileName('');
        setIsAddLicenseOpen(false);
    }

    const hoverLicense = (id) => { setHovered(prev => (prev === id ? null : id)) }

    const editLicense = (id) => {
        setInputOpen(prev => (prev === id ? null : id))
        console.log('Open: ', id)
    }


    // queries and shit
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


    const { mutate: deleteLicense } = useMutation({
        mutationFn: async (license_id) => {
            try {
                const response = await axios.delete(`${base_url}/license/remove/${license_id}`, {
                    withCredentials: true
                });

                console.log(response.data);
                return response.data;
            } catch(err) {
                console.error('Failed to delete license: ', err);
            }
        },
        onSuccess: () => {
            setInputOpen(false);
            queryClient.invalidateQueries(['license'])
            // alert('Deleted license successfully!');
        }
    });

    const { data: license = [], isLoading } = useLicense();




    return (
        <section className='flex flex-col w-full gap-4'>
            <div className='flex items-center justify-between w-full border-t border-t-[#CCC] pt-2'>
                <span className='text-[#005F60] text-[18px] font-bold'>License Type</span>
                <button onClick={() => setIsAddLicenseOpen(true)} className='flex items-center gap-2 font-bold px-3 py-1 rounded-[5px] bg-[#03f8c5] text-[#005F60] hover:opacity-75 active:opacity-100'>
                    + Add License
                </button>
            </div>

            <div className='flex flex-col w-full gap-1 items-start justify-center'>
                {license.map((lic) => (
                    <div key={lic.id} onMouseEnter={() => hoverLicense(lic.id)} onMouseLeave={() => hoverLicense(null)} className='flex items-center justify-between w-full h-auto gap-1 cursor-pointer overflow-hidden bg-[#EADCA7] rounded-[5px]'>
                        
                        <div className='flex items-center gap-3 px-3 py-2  w-full'>
                            {inputOpen === lic.id ? (
                                <input type="text" value={newLicense || lic.license || ''} onChange={(e) => setNewLicense(e.target.value)} className='px-3 py-1 rounded-[5px] bg-[#f2e9c9] focus:outline-[#d2b545]'/>
                            ) : (
                                <a href={lic.document_url} target='_blank' className='font-bold hover:underline active:text-[#03f8c5]'>{lic.license}</a>
                            )}

                        </div>


                        
                        {hovered === lic.id && (
                            <div className='flex items-center pr-1'>
                                {inputOpen === lic.id ? (
                                    <div className='flex items-center w-full'>
                                        <button className='px-1 opacity-50 hover:opacity-100 active:opacity-50'>Save</button>
                                        <button onClick={() => {editLicense(null); setNewLicense('')}} className='px-2 opacity-50 hover:opacity-100 active:opacity-50'>Cancel</button>
                                    </div>
                                ) : (
                                    <button onClick={() => {editLicense(lic.id); setNewLicense('')}} className='flex items-center justify-center p-2 opacity-50 hover:opacity-100 active:opacity-50' title='Edit'>
                                        Edit
                                    </button>
                                )}


                                <span className='opacity-50'>|</span>
                                <button onClick={() => deleteLicense(lic.id)} className='p-2 opacity-50 hover:opacity-100 active:opacity-50' title='Delete'>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                    
                

                {isAddLicenseOpen && (
                <form onSubmit={handleFileChange} className='flex items-center w-full gap-2'>
                    <input type="text" placeholder='Enter a name for the license type' className='w-full px-3 py-2 rounded-[5px] border border-[#CCC] focus:border-[#2A2A2A] focus:outline-none'
                    value={licenseType} onChange={(e) => {setLicenseType(e.target.value); setError('')}}/>

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
                        <button type='button' onClick={cancelFileChange} className='px-3 py-2 bg-[#EADCA7] rounded-[5px] border border-[#BBB] hover:opacity-75 active:opacity-100'>Cancel</button>
                    </div>
                </form>
                )}
                {error && <span className='text-[#FF0000] text-[14px] font-bold px-2'>{error}</span>}
            </div>
        </section>
    )
}

export default ManageLicense