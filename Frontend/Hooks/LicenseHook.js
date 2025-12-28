import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const base_url = 'http://localhost:5000';

export function useLicense() {
  return useQuery({
    queryKey: ['license'],
    queryFn: async () => {
        try {
            const response = await axios.get(`${base_url}/license`, {
                withCredentials: true
            });
    
            console.log(response.data)
            return response.data;
        } catch (err) {
            console.error('Failed to retrieve license data: ', err);
        }
    }
  })
}
