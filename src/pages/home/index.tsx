import { canSSRAuth } from "@/utils/canSSRAuth"
import Head from "next/head"
import { Header } from '../../components/Header'
import { AuthContext } from '../../contexts/AuthContext';
import { useContext} from 'react';
import styles from '../../../styles/home.module.scss'

export default function Home(){
  const { user } = useContext(AuthContext);
    return(
      <>
      <Head>
        <title>Inner Friend - Home</title>
      </Head>
      <div>
        <Header/>
        <div className={styles.divCenter}>
          <h1>Bem Vindo ao Inner Friend {user?.name}, o seu amigo interior.</h1>
        </div>
      </div>
      </>
    )
  }
export const getServerSideProps = canSSRAuth(async () =>{
    return {
      props:{}
    }
})





