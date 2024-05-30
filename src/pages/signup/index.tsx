import Head from 'next/head'
import Image from 'next/image'
import logoImg from '../../../public/logo.png'
import styles from '../../../styles/home.module.scss'

import {Input} from '../../components/ui/Input'
import {Button} from '../../components/ui/Button'

import Link from 'next/link';

export default function Signup() {
  return (
    <>
    <Head>
        <title>InnerFriend - Cadastre-se</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo Inner Friend"/>

      <div className={styles.login}>
          <h1>Criando sua conta</h1>
          <form action="">
            <Input
              placeholder='Digite seu nome'
              type='text'
            />

            <Input
              placeholder='Digite seu email'
              type='text'
            />

            <Input
              placeholder='Sua senha'
              type='password'
            />

            <Button
              type='submit'
              loading={false}
            >
              Cadastrar
            </Button>        
          </form>

        <Link href='/' className={styles.text}>
          Já possui uma conta? Faça login
        </Link>

    </div>
    </div>
    </>
  )
}
