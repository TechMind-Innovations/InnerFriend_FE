import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import { Header } from '../../components/Header';
import Image from 'next/image';
import styles from './About.module.scss';

export default function About() {
  const teamMembers = [
    {
      name: 'Matheus Henrique Souza',
      role: 'Desenvolvedor Full Stack',
      age: '19 anos',
      description: 'Sempre fui apaixonado em criar algo, e a programação me deu essa oportunidade.',
      photo: '/path-to-photo1.jpg'
    },
    {
      name: 'Yuri Manoel de Assunção Neto',
      role: 'Desenvolvedor',
      age: '21 anos',
      description: '',
      photo: '/path-to-photo2.jpg'
    },
    {
      name: 'Wisley Victor Ferreira Santos',
      role: 'Desenvolvedor Mobile e Full Stack',
      age: '21 anos',
      description: 'Gosto de inovação e na programação inovação é o que mais tem, por isso escolhi ser desenvolvedor!',
      photo: '/path-to-photo3.jpg'
    }
  ];

  return (
    <>
      <Head>
        <title>Inner Friend - Sobre Nós</title>
      </Head>
      <div>
        <Header />
        <div className={styles.container}>
          <h1>Sobre Nós</h1>
          <div className={styles.cardContainer}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.card}>
                <Image src={member.photo} alt={member.name} width={150} height={150} className={styles.photo} />
                <div className={styles.info}>
                  <h2>{member.name}</h2>
                  <p>{member.role}</p>
                  <p>{member.age}</p>
                  <p>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  }
});
