import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const base_url = 'http://localhost:5000';

export function useGenre() {
  return useQuery({
    queryKey: ['genre'],
    queryFn: async () => {
        try {
          const response = await axios.get(`${base_url}/genre/all`, {
              withCredentials: true
          });

          if (!response.data) {
            throw new Error('No genres returned');
          }

          // console.log(response.data)
          // react-query rule is query functions should not return null/undefine

          return response.data ?? [];
        } catch (err) {
            console.error('Error retreiving genre data: ', err);
            throw err;
        }
    }, 
    retry: false
  })
}