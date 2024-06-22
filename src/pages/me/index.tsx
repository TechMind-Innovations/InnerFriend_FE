import { FormEvent, useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { UserContext } from '../../contexts/UserContext';
import { canSSRAuth } from '../../utils/canSSRAuth';
import styles from './User.module.scss';
import { toast } from 'react-toastify';
import { getCountries } from '../../services/api';
import Link from 'next/link';
import Modal from 'react-modal';
import { Header } from '../../components/Header'

Modal.setAppElement('#__next');

export default function Me() {
  const { getUser, upUser, removePhoto } = useContext(UserContext);

  const [name, setName] = useState('');
  const [social_name, setSocialName] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState('');
  const SexEnum = Object.freeze({
    male: { value: 'Male', label: 'Masculino' },
    female: { value: 'Female', label: 'Feminino' },
    other: { value: 'Other', label: 'Outro' },
  });
  const [region, setRegion] = useState('');
  const [regions, setRegions] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
        setSocialName(data.social_name || '');
        setYear(data.year.toString());
        setEmail(data.email);
        setSex(data.sex);
        setRegion(data.region);
        setCurrentPhoto(data.photo ? `data:image/jpeg;base64,${data.photo}` : null);
      }
    }

    fetchUser();
  }, [getUser]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setCurrentPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  async function handleUpUser(event: FormEvent) {
    event.preventDefault();

    if (name === '' || email === '' || sex === '' || year === '') {
      toast.warning('Preencha todos os campos obrigatórios!');
      return;
    }

    await upUser({
      name,
      social_name,
      year: Number(year),
      email,
      sex,
      region
    }, photo);
  }

  return (
    <>
      <Head>
        <title>InnerFriend - Me</title>
      </Head>
      <Header />
      <div className={styles.containerCenter}>
        <Image
          src={currentPhoto || '/photoDefault.png'}
          alt="Profile Picture"
          width={200}
          height={200}
          onClick={openModal}
          className={styles.profilePic}
        />

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Atualizar a foto do Perfil"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <button className={styles.closeButton} onClick={closeModal}>×</button>
          <h2>Atualizar a foto do Perfil</h2>
          <div className={styles.center}>
            <Image
            src={currentPhoto || '/photoDefault.png'}
            alt="Profile Picture"
            width={200}
            height={200}
            onClick={openModal}
            className={styles.profilePic}
            />
          </div>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </Modal>


        <div className={styles.signupContainer}>
          <div className={styles.formColumn}>
            <h1>Atualizar Perfil</h1>
            <form onSubmit={handleUpUser}>
              <div className={styles.inputGroup}>
                <label>Nome</label>
                <Input
                  placeholder='Digite seu nome'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Nome Social (opcional)</label>
                <Input
                  placeholder='Digite seu social name (opcional)'
                  type='text'
                  value={social_name}
                  onChange={(e) => setSocialName(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Idade</label>
                <Input
                  placeholder='Digite sua idade'
                  type='number'
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Email</label>
                <Input
                  placeholder='Digite seu email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Sexo</label>
                <Select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option value="">Selecione seu sexo</option>
                  <option value={SexEnum.male.value}>{SexEnum.male.label}</option>
                  <option value={SexEnum.female.value}>{SexEnum.female.label}</option>
                  <option value={SexEnum.other.value}>{SexEnum.other.label}</option>
                </Select>
              </div>

              <div className={styles.inputGroup}>
                <label>País</label>
                <Select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="">Selecione seu país</option>
                  {regions.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                  ))}
                </Select>
              </div>

              <Button type='submit'>
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
  );
}

export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});
