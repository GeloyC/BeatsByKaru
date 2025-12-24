import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { createContext, useContext } from 'react'
import axios from 'axios';



const userContext = createContext(null);

export const UserProvider = ({ children }) => {
    const base_url = 'http://localhost:5000';

    const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${base_url}/user`, {
                    withCredentials: true
                });

                return response.data?.user?.username || null;

            } catch(err) {
                console.error('Failed to fetch user data: ', err);
                return null;
            } 
        }
    });


    return (
        <userContext.Provider value={{ user, isLoading }}>
            { children }
        </userContext.Provider>
    )
}

export const useUser = () => {
    const userCtx = useContext(userContext);
    if (!userCtx) throw new Error('useUser must be used inside userProvider!');

    return userCtx;
}