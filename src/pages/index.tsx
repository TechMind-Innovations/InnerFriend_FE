import Head from 'next/head'
import Image from 'next/image'
import logoImg from '../../public/logo.png'
import styles from '../../styles/home.module.scss'
import { useContext, FormEvent , useState} from 'react'

import {Input} from '../components/ui/Input'
import {Button} from '../components/ui/Button'
import {AuthContext} from '../contexts/AuthContext'

import Link from 'next/link';
import {toast} from 'react-toastify'

export default function Home() {
  const {signIn} = useContext(AuthContext)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin(event:FormEvent){
    event.preventDefault();//impedir ficar recarregando a página

    if(email == '' || password == ''){
      toast.warning('Preecha os dados!')
      return;
    }      

    setLoading(true);

    let data = {
      email,
      password
    }

    await signIn(data)

    setLoading(false);
  }

  return (
    <>
    <Head>
        <title>InnerFriend - Login</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo Inner Friend"/>

      <div className={styles.login}>
        <form onSubmit={handleLogin}>
          <Input
            placeholder='Digite seu email'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder='Digite sua senha'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type='submit'
            loading={loading}
          >
            Acessar
          </Button>        
        </form>

        <Link href='/signup' className={styles.text}>
          Não possui uma conta? Cadastre-se
        </Link>

    </div>
    </div>
    </>
  )
}
