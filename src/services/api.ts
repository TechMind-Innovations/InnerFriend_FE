import axios, {AxiosError} from 'axios'
import { headers } from 'next/headers';
import {parseCookies} from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'
import { signOut} from '../contexts/AuthContext'

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);
    const apiUrl = process.env.API_URL;
    const api = axios.create({
        baseURL: `${apiUrl}`,
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


export const sendMessageToChatbot = async (message: string) => {
    const api = setupAPIClient();
    try {
      const response = await api.post('/api/chat', { message });
      return response.data.message;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      return 'Erro ao enviar mensagem para o chatbot.';
    }
  };