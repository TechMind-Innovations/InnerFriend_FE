import React, { useState, useEffect, useRef, useContext } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import styles from './Chatbot.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from "@/utils/canSSRAuth";
import { UserContext, UserProps } from '../../contexts/UserContext';
import { IA_FriendContext } from '../../contexts/IA_FriendContext';
import Router from 'next/router';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import Image from 'next/image';

export default function Home() {
  const { enviarMensagem, enviarImagem } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const [chat, setChat] = useState<{ usuario: boolean, texto: string, avatar: string }[]>([]);
  const [imagemSelecionada, setImagemSelecionada] = useState<File | null>(null);
  const { getUser } = useContext(UserContext);
  const [userData, setUserData] = useState<UserProps | null>(null);
  const { getIA } = useContext(IA_FriendContext);
  const [iaName, setIaName] = useState('');
  const [iaPhoto, setIaPhoto] = useState('');
  const lastMessageRef = useRef<HTMLParagraphElement>(null); // Referência para a última mensagem
  let isShow = true;
  const { user } = useContext(AuthContext);
  const [refreshed, setRefreshed] = useState(false);



  useEffect(() => {
    const fetchIAData = async () => {
      const data = await getIA();
      if (data) {
        setIaName(data.name);
        setIaPhoto(data.photo);
      }
      if (!data || data.name.trim() === '') {
        Router.push('/ia_friend');
        if(isShow && !UserContext.displayName){
          toast.warning('Que tal adicionar um nome ao teu amigo?');
          isShow = false;
        }
      }
    };

    fetchIAData();
  }, [getIA]);



  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      if (data) {
        setUserData(data);
      }
    };

    fetchUserData();
  }, [getUser]);

  useEffect(() => {
    const mensagemBoasVindas = `Olá ${userData?.social_name ? userData.social_name : userData?.name}! Eu sou ${iaName} da TechMind<br/><br/>Como posso te ajudar?`;
    const userAvatar = userData?.photo?.startsWith('data:image') ? userData.photo : (userData?.photo || '/photoDefault.png');
    const iaAvatar = iaPhoto ? `/avatar/${iaPhoto}` : '/icon.png';
    setChat([{ usuario: false, texto: mensagemBoasVindas, avatar: iaAvatar }]);
  }, [iaName, iaPhoto, userData]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' }); // Rolar para a última mensagem
    }
  }, [chat]);

  const handleSendMessage = async () => {
    if (inputValue === '') return;

    const mensagem = inputValue;
    setInputValue('');

    const userAvatar = userData?.photo ? userData.photo : (userData?.photo || '/photoDefault.png');
    const iaAvatar = iaPhoto ? `/avatar/${iaPhoto}` : '/icon.png';
    setChat([...chat, { usuario: true, texto: mensagem, avatar: userAvatar }, { usuario: false, texto: 'Digitando ...', avatar: iaAvatar }]);
    const resposta = await enviarMensagem(mensagem, Number(userData?.year));
    setChat(prevChat => [...prevChat.slice(0, -1), { usuario: false, texto: resposta.replace(/\n/g, '<br>'), avatar: iaAvatar }]);
  };

  const handleInputKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleImageUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (imagemSelecionada) {
          setImagemSelecionada(null);
        }
        setImagemSelecionada(file);

        const resposta = await enviarImagem(file);
        console.log(resposta);
      }
    };

    fileInput.click();
  };

  return (
    <div className={styles.chatContainer}>
      <Header />
      <div className={styles.mainContainer}>
        <main className={styles.main}>
          <section className={styles.chat} id="chat">
            {chat.map((msg, index) => (
              <div key={index} className={`${styles.chatMessageContainer} ${msg.usuario ? styles.chatMessageContainerUser : styles.chatMessageContainerBot}`} ref={index === chat.length - 1 ? lastMessageRef : null}>
                {!msg.usuario && <img src={msg.avatar} alt="Avatar" className={styles.chatAvatar} />} {/*Avatar do bot*/ }
                <p className={`${styles.chatBolha} ${msg.usuario ? styles.chatBolhaUsuario : styles.chatBolhaBot}`}>
                  <span dangerouslySetInnerHTML={{ __html: msg.texto }} />
                </p>
                {msg.usuario && <Image
                                  src={user?.photo || '/photoDefault.png'}
                                  alt="User Photo"
                                  className={styles.profilePhoto}
                                  width={50}
                                  height={50}
                                />
                }                
              </div>
              
            ))}
          </section>
          <section className={styles.entrada}>
            <div className={styles.entradaContainer}>
              <button onClick={handleImageUpload} aria-label="Botão de mais opções">
                <i className={`${styles.icone} ${styles.iconeMaisOpcoes}`}></i>
              </button>
              <input
                type="text"
                className={styles.entradaInput}
                placeholder="Enviar uma mensagem"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyUp={handleInputKeyUp}
              />
              <button onClick={handleSendMessage} aria-label="Botão de enviar">
                <img className={`${styles.icone} ${styles.iconeEnviarMensagem}`} />
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  }
});
