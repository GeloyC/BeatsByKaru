import { queryOptions, useMutation, useQuery, useQueryErrorResetBoundary } from "@tanstack/react-query";
import axios from 'axios';

const base_url = import.meta.env.VITE_API_BASE_URL;

export function useSingle() {
    return useQuery({
        queryKey: ['single'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${base_url}/audio/singles`, {
                    withCredentials: true
                });

                return response.data ?? [];
            } catch (err) {
                console.error('Error retreiving audio data: ', err);
                throw err;
            }
        }
    });
}


// Beat tapes > tracks under is singles inside
export function useBeatTapes() {
    return useQuery({
        queryKey: ['beat-tape'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${base_url}/audio/beat_tapes`, {
                    withCredentials: true
                })

                return response?.data ?? [];

            } catch (err) {
                console.log('Failed to retreive beat tape data: ', err);
            }
        }

    });
}

export function useBeatTapeTracks(id) {
    return useQuery({
        queryKey: ['beat-tape-tracks', Number(id)],
        queryFn: async () => {
            try {

                if (!id || isNaN(id)) {
                    throw new Error('Valid beat tape ID is required');
                }

                const response = await axios.get(`${base_url}/audio/beat_tape/${id}/tracks`, {
                    withCredentials: true
                });

                console.log('data on beattape: ', response?.data);
                return response?.data ?? [];
                
            } catch (err) {
                console.error('Failed to retreive beat tape tracks: ', err);
            }
        } 
    })
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
                const response = await axios.get(`${base_url}/audio/single/available`, { withCredentials: true });

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



