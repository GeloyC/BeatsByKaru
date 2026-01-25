import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const base_url = 'http://localhost:5000';

export function useAudio() {
    return useQuery({
        queryKey: ['audio'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${base_url}/audio/all`, {
                    withCredentials: true
                });

                if (!response.data) {
                    console.log(error)
                    throw new Error('No audios returned');
                }

                console.log(response.data);
                return response.data ?? [];
            } catch (err) {
                console.error('Error retreiving audio data: ', err);
                throw err;
            }
        }, 
        retry: false
    });
}