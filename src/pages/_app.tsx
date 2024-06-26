import {AppProps } from 'next/app';
import '../../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
import {ChatbotProvider} from '../contexts/ChatbotContext'
import {AuthProvider} from '../contexts/AuthContext'
import { IA_FriendProvider } from '../contexts/IA_FriendContext'
import { UserProvider } from '../contexts/UserContext';


function MyApp({ Component, pageProps }:AppProps) {
  return (
    <AuthProvider>
      <IA_FriendProvider>
        <UserProvider>
          <ChatbotProvider>
            <Component {...pageProps} /> 
            <ToastContainer autoClose={3000}/>  
          </ChatbotProvider>
        </UserProvider>
      </IA_FriendProvider>
    </AuthProvider>
  ) 
}

export default MyApp
