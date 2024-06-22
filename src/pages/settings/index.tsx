import { canSSRAuth } from "@/utils/canSSRAuth"
import Head from "next/head"
import { Header } from '../../components/Header'


export default function Settings(){
    return(
      <>
      <Head>
        <title>Inner Friend - Configurações</title>
      </Head>
      <div>
        <Header/>
      
        <h1>Tela de Configurações</h1>
      </div>
      </>
    )
  }
export const getServerSideProps = canSSRAuth(async () =>{
    return {
      props:{}
    }
})





