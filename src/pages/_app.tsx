import {AppProps } from 'next/app';
import '../../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'

import {AuthProvider} from '../contexts/AuthContext'
import { IA_FriendProvider } from '../contexts/IA_FriendContext'


function MyApp({ Component, pageProps }:AppProps) {
  return (
    <AuthProvider>
      <IA_FriendProvider>
        <Component {...pageProps} /> 
        <ToastContainer autoClose={3000}/>   
      </IA_FriendProvider>
    </AuthProvider>
  ) 
}

export default MyApp
