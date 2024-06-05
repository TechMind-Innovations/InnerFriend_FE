import { FormEvent, useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import logoImg from '../../../public/logo.png'
import styles from './iaFriend.module.scss'

import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select';
import { IA_FriendContext } from '../../contexts/IA_FriendContext'
import { canSSRAuth } from '../../utils/canSSRAuth'

import { toast } from 'react-toastify'

import Link from 'next/link';

export default function IAFriend() {
  const { upIA, getIA } = useContext(IA_FriendContext);

  const [name, setName] = useState('');
  const [sex_ia, setSexIA] = useState('');
  const [age_average, setAgeAverage] = useState('');
  const [loading, setLoading] = useState(false);

  const SexEnum = Object.freeze({
    male: { value: 'Male', label: 'Masculino' },
    female: { value: 'Female', label: 'Feminino' },
    other: { value: 'Other', label: 'Outro' },
  });

  useEffect(() => {
    async function fetchIA() {
      const data = await getIA();
      if (data) {
        setName(data.name);
        setSexIA(data.sex_ia);
        setAgeAverage(data.age_average.toString());
      }
    }

    fetchIA();
  }, [getIA]);

  async function handleSignUpFriend(event: FormEvent) {
    event.preventDefault();

    if (name === '' || sex_ia === '' || age_average === '') {
      toast.warning('Preencha todos os campos obrigatórios!')
      return;
    }

    setLoading(true);

    await upIA({
      name,
      sex_ia,
      age_average: Number(age_average)
    });

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>InnerFriend - Cadastro do Amigo</title>
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
                placeholder='Nome do amigo'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Select
                value={sex_ia}
                onChange={(e) => setSexIA(e.target.value)}
              >
                <option value="">Selecione o sexo do amigo</option>
                <option value={SexEnum.male.value}>{SexEnum.male.label}</option>
                <option value={SexEnum.female.value}>{SexEnum.female.label}</option>
                <option value={SexEnum.other.value}>{SexEnum.other.label}</option>
              </Select>

              <Input
                placeholder='Idade média do amigo'
                type='number'
                value={age_average}
                onChange={(e) => setAgeAverage(e.target.value)}
              />

              <Button
                type='submit'
                loading={loading}
              >
                Cadastrar
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
