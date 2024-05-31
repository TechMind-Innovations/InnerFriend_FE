import axios, {AxiosError} from 'axios'
import { headers } from 'next/headers';
import {parseCookies} from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'
import { signOut} from '../contexts/AuthContext'

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'http://127.0.0.1:5000',
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`            
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError)=>{
        if(error.response?.status === 401){
            if(typeof window !== undefined){
                //deslogar o user
                signOut();
            }
            else{
                return Promise.reject(new AuthTokenError())
            }
        }

        return Promise.reject(error);
    })

    return api;

}


export const getCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countries = response.data.map((country: any) => country.translations.por.common);
    return countries.sort();
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};
