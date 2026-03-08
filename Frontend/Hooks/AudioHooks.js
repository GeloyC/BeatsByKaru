import { queryOptions, useMutation, useQuery, useQueryErrorResetBoundary } from "@tanstack/react-query";
import axios from 'axios';

const base_url = import.meta.env.VITE_API_BASE_URL;

export function useAudio() {
    return useQuery({
        queryKey: ['audio'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${base_url}/audio/pending`, {
                    withCredentials: true
                });

                if (!response.data) {
                    throw new Error('No pending audios returned');
                }

                return response.data ?? [];
            } catch (err) {
                console.error('Error retreiving pending audio data: ', err);
                throw err;
            }
        }, 
        retry: false
    });
}

export function useSingle() {
    return useQuery({
        queryKey: ['single'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${base_url}/audio/all`, {
                    withCredentials: true
                });

                if (!response.data) {
                    throw new Error('No audios returned');
                }

                console.log('Audio Single', response.data)

                return response.data ?? [];
            } catch (err) {
                console.error('Error retreiving audio data: ', err);
                throw err;
            }
        }
    });
}

// To use for uploading Singles Track
// Retrieve unpublished tracks that are available to publish as 'Single'
export function useAvailable() {
    return useQuery({
        queryKey: ['single'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${base_url}/audio/available`, {
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
        }
    });
}

// Retrieve Singles Tracked that are available
// Can be used to publish in a Beat Tape
export function useSingleAvailable() {
    return useQuery({
        queryKey: ['SingleAvailable'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${base_url}/audio/single/list/available`, { withCredentials: true });

                if (!response.data) {
                    throw new Error('No audios returned');
                }

                return response.data ?? [];
            } catch (err) {
                console.error("Error retrieving 'Available' singles track: ", err);
                throw err;
            }
        }
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
