import { canSSRAuth } from "@/utils/canSSRAuth"
import Head from "next/head"
import { signOut } from "@/contexts/AuthContext"
import {AuthContext} from '../../contexts/AuthContext'

import { Header } from '../../components/Header'


export default function Home(){
    return(
      <>
      <Head>
        <title>Inner Friend - Home</title>
      </Head>
      <div>
        <Header/>
      
        <h1>Welcome Bro</h1>
      </div>
      </>
    )
  }
export const getServerSideProps = canSSRAuth(async () =>{
    return {
      props:{}
    }
})





