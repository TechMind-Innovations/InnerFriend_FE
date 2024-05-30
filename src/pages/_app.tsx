import {AppProps } from 'next/app'
import '../../styles/globals.scss'

import {AuthProvider} from '../contexts/AuthContext'

function MyApp({ Component, pageProps }:AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />    
    </AuthProvider>
  ) 
}

export default MyApp
