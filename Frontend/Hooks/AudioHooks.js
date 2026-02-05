import { useMutation, useQuery, useQueryErrorResetBoundary } from "@tanstack/react-query";
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
                    throw new Error('No audios returned');
                }

                return response.data ?? [];
            } catch (err) {
                console.error('Error retreiving audio data: ', err);
                throw err;
            }
        }, 
        retry: false
    });
}


export async function selectedTrackSingle(audio_id) {
    if (!audio_id) {
        throw new Error('audio_id is required!');
    }

    const response = await axios.get(`${base_url}/audio/single/${audio_id}`, {
        withCredentials: true
    });

    return response.data;
}
