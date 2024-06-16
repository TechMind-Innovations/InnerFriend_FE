import { FormEvent, useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import logoImg from '../../../public/logo.png'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select';
import { UserContext } from '../../contexts/UserContext'
import { canSSRAuth } from '../../utils/canSSRAuth'
import styles from './User.module.scss'
import { toast } from 'react-toastify'
import { getCountries } from '../../services/api';

import Link from 'next/link';

export default function Me() {
  const { getUser, upUser } = useContext(UserContext);

  const[name, setName] = useState('')
  const[social_name, setSocialName] = useState('')
  const[year, setYear] = useState('')
  const[email, setEmail] = useState('')
  const[sex, setSex] = useState('')
  const SexEnum = Object.freeze({
    male: { value: 'Male', label: 'Masculino' },
    female: { value: 'Female', label: 'Feminino' },
    other: { value: 'Other', label: 'Outro' },
  });
  const [region, setRegion] = useState('');
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const regions = await getCountries();
      setRegions(regions);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const data = await getUser();
      if (data) {
        setName(data.name);
        setSocialName(data.social_name||'');
        setYear(data.year.toString());
        setEmail(data.email);
        setSex(data.sex);
        setRegion(data.region)
        }
    }

    fetchUser();
  }, [getUser]);

  async function handleSignUpFriend(event: FormEvent) {
    event.preventDefault();

    if (name === '' || email === '' || sex === '' || year==='') {
      toast.warning('Preencha todos os campos obrigatórios!')
      return;
    }


    await upUser({
        name,
        social_name,
        year: Number(year),
        email,
        sex,
        region
    });

  }

  return (
    <>
      <Head>
        <title>InnerFriend - Me</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image
          src={logoImg}
          alt="Logo Inner Friend"
          width={200}
        />

        <div className={styles.signupContainer}>
          <div className={styles.formColumn}>
            <h1>Cadastro do Amigo</h1>
            <form onSubmit={handleSignUpFriend}>
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
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">Selecione seu país</option>
              {regions.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </Select>

              <Button
                type='submit'
              >
                Salvar
              </Button>
            </form>

            <Link href='/' className={styles.text}>
              Voltar para tela principal
            </Link>

          </div>
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
