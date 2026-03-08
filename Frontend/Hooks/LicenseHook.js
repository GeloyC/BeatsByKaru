import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const base_url = import.meta.env.VITE_API_BASE_URL;

export function useLicense() {
  return useQuery({
    queryKey: ['license'],
    queryFn: async () => {
        try {
            const response = await axios.get(`${base_url}/license`, {
                withCredentials: true
            });
    
            return response.data;
        } catch (err) {
            console.error('Failed to retrieve license data: ', err);
        }
    }
  })
}
