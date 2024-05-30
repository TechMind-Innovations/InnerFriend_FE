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