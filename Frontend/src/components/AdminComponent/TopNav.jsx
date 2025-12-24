import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Link } from 'react-router-dom'

const TopNav = () => {
    const base_url = 'http://localhost:5000';
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await axios.get(`${base_url}/user`, { withCredentials:true })  
            // console.log(response.data.user)

            if (response.data === null) {
                return ;
            } else {
                return response.data.user.username;
            }
        },
        retry: false
    });
    

    const {mutate: logout } = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${base_url}/user/logout`, 
                {},  
                { withCredentials:true });

                return response.data;
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null)
            navigate('/admin');
        }, 
        onError: (err) => {
            console.error('Failed to log out: ', err);
        },
    });

    return (
        <div className='sticky top-0 flex items-center justify-between w-full bg-[#FFF] px-4 py-2 border-b border-b-[#DDDDDD] z-20'>
            <div className='flex items-center justify-center font-bold'>
                Beats by Karu [ADMIN]
            </div>


            <div className='flex items-center gap-3 w-fit'>
                

                <div className='flex items-center gap-3 w-full'>
                    <Link to='/' className='size-9 p-1.5 border border-[#CCC] bg-[#EEE] hover:bg-[#DDD] active:bg-[#EEE] rounded-full'>
                        <img src="/src/assets/icons/home-page.png" alt="home-icon" />
                    </Link>
                    
                    {isLoading ? (
                        <div className='flex w-full bg-[#FFF] h-auto'> ... </div>
                    ) : data ? (
                        <div onClick={() => setIsLogoutOpen(prev => !prev)} className='relative flex flex-col cursor-pointer active:opacity-50'>
                            <span className="font-bold px-3 py-1 bg-[#EEE] rounded-[5px] border border-[#CCC]"> {data} </span>
                            {isLogoutOpen && (
                                <button onClick={() => logout()} className='absolute -bottom-10 right-0 bg-[#FFF] border-[#CCC] border px-3 py-1 rounded-[5px] hover:bg-[#BBB] active:bg-[#CCC]'>Log out</button>
                            )}
                        </div> 
                    ) : (
                        <Link to="/admin" className="font-bold bg-[#DDDDDD] hover:bg-[#CCCCCC] active:bg-[#DDDDDD] p-3 rounded-[5px]" >
                        Login
                        </Link>
                    )}
                    

                    
                </div>
            </div>
        </div>
    ) 
}

export default TopNav