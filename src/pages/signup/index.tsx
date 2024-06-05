import { FormEvent, useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import logoImg from '../../../public/logo.png'
import styles from '../../../styles/home.module.scss'

import {Input} from '../../components/ui/Input'
import {Button} from '../../components/ui/Button'
import {Select} from '../../components/ui/Select';
import {AuthContext} from '../../contexts/AuthContext'
import {canSSRGuest} from '../../utils/canSSRGuest'

import { getCountries } from '../../services/api';
import {toast} from 'react-toastify'

import Link from 'next/link';

export default function Signup() {
  const {signUp} = useContext(AuthContext);

  const[name, setName] = useState('')
  const[social_name, setSocialName] = useState('')
  const[year, setYear] = useState('')
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const[sex, setSex] = useState('')
  const SexEnum = Object.freeze({
    male: { value: 'Male', label: 'Masculino' },
    female: { value: 'Female', label: 'Feminino' },
    other: { value: 'Other', label: 'Outro' },
  });
  const [country, setCountry] = useState('');

  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await getCountries();
      setCountries(countries);
    };
    fetchCountries();
  }, []);

  async function handleSignUp(event: FormEvent){
    event.preventDefault(); //padrão para verificar se está ok

    if(name == '' || email =='' || password == '' || sex == '' || year == null || sex == '' || country == ''){
      toast.warning('Preencha todos os campos obrigatórios!')
      return;
    }

    if (password !== confirmPassword) {
      toast.warning('Verifique sua senha!')
      setPasswordError(true);
      return;
    }

    setPasswordError(false);
    setLoading(true)

    let data = {
      name,
      social_name,
      year: Number(year),
      email,
      sex,
      country,
      password
    }

    await signUp(data)

    setLoading(false)

  }

  return (
    <>
    <Head>
        <title>InnerFriend - Cadastre-se</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image 
        src={logoImg} 
        alt="Logo Inner Friend"
        width={200}
      />

      <div className={styles.login}>
          <h1>Criando sua conta</h1>
          <form onSubmit={handleSignUp}>
          <Input
              placeholder='Digite seu nome'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder='Digite seu social name (opicional)'
              type='text'
              value={social_name}
              onChange={(e) => setSocialName(e.target.value)}
            />

            <Input
              placeholder='Digite sua idade'
              type='number'
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <Input
              placeholder='Digite seu email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Select 
              value={sex}  
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="">Selecione seu sexo</option>
              <option value={SexEnum.male.value}>{SexEnum.male.label}</option>
              <option value={SexEnum.female.value}>{SexEnum.female.label}</option>
              <option value={SexEnum.other.value}>{SexEnum.other.label}</option>
            </Select>

            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Selecione seu país</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </Select>

            <Input
              placeholder='Sua senha'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderColor: passwordError ? 'red' : '' }}
            />

            <Input
              placeholder='Confirme sua senha'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ borderColor: passwordError ? 'red' : '' }}
            />

            {passwordError && (
              <p style={{ color: 'red' }}>As senhas não coincidem</p>
            )}

            <Button
              type='submit'
              loading={loading}
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
export const getServerSideProps = canSSRGuest(async () =>{
  return {
    props:{}
  }
})