import { FormEvent, useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from './iaFriend.module.scss'
import { Header } from '../../components/Header'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select';
import { IA_FriendContext } from '../../contexts/IA_FriendContext'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { toast } from 'react-toastify'
import Link from 'next/link';
import PhotoPopup from '../../components/PhotoComponent/PhotoPopup';

export default function IAFriend() {
  const { upIA, getIA } = useContext(IA_FriendContext);

  const [name, setName] = useState('');
  const [sex_ia, setSexIA] = useState('');
  const [age_average, setAgeAverage] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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
        setPhoto(data.photo);
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
      age_average: Number(age_average),
      photo
    });

    setLoading(false);
  }

  function handleSelectPhoto(selectedPhoto: string) {
    setPhoto(selectedPhoto);
    setShowPopup(false);
  }

  return (
    <>
      <Head>
        <title>InnerFriend - Cadastro do Amigo</title>
      </Head>
      <Header />
      <div className={styles.containerCenter}>
        <div className={styles.photoContainer} onClick={() => setShowPopup(true)}>
          {photo ? (
            <Image
              src={`/avatar/${photo}`}
              alt="Foto do Amigo"
              width={300}
              height={300}
            />
          ) : (
            <Image
              src="/photoDefault.png"
              alt="Foto default"
              width={300}
              height={300}
            />
          )}
        </div>

        <div className={styles.signupContainer}>
          <div className={styles.formColumn}>
            <h1>Informações do Amigo</h1>
            <form onSubmit={handleSignUpFriend}>
              <div className={styles.inputGroup}>
                <label>Nome:</label>
                <Input
                  placeholder='Nome do amigo'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Sexo:</label>
                <Select
                  value={sex_ia}
                  onChange={(e) => setSexIA(e.target.value)}
                >
                  <option value="">Selecione o sexo do amigo</option>
                  <option value={SexEnum.male.value}>{SexEnum.male.label}</option>
                  <option value={SexEnum.female.value}>{SexEnum.female.label}</option>
                  <option value={SexEnum.other.value}>{SexEnum.other.label}</option>
                </Select>
              </div>

              {/* <div className={styles.inputGroup}>
                <label>Idade:</label>
                <Input
                  placeholder='Idade média do amigo'
                  type='number'
                  value={age_average}
                  onChange={(e) => setAgeAverage(e.target.value)}
                />
              </div> */}

              <Button
                type='submit'
                loading={loading}
              >
                Salvar
              </Button>
            </form>

            <Link href='/' className={styles.text}>
              Voltar para tela principal
            </Link>
          </div>
        </div>

        {showPopup && (
          <PhotoPopup
            onClose={() => setShowPopup(false)}
            onSelectPhoto={handleSelectPhoto}
          />
        )}
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  }
})
