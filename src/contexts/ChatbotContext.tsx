import React, { createContext, useContext, ReactNode } from 'react';

interface ChatbotContextProps {
  enviarMensagem: (mensagem: string, idade: number) => Promise<string>;
  enviarImagem: (imagem: File) => Promise<string>;
}

interface ChatbotProviderProps {
  children: ReactNode;
}

const ChatbotContext = createContext<ChatbotContextProps | undefined>(undefined);

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const enviarMensagem = async (mensagem: string, idade: number) => {
    const resposta = await fetch("http://127.0.0.1:5000/chatGPT/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: mensagem, age: idade }),
    });
    const texto_da_resposta = await resposta.text();
    return texto_da_resposta;
  };

  const enviarImagem = async (imagem: File) => {
    let formData = new FormData();
    formData.append("imagem", imagem);

    const response = await fetch("http://127.0.0.1:5000/upload_imagem", {
      method: 'POST',
      body: formData
    });

    const resposta = await response.text();
    return resposta;
  };

  return (
    <ChatbotContext.Provider value={{ enviarMensagem, enviarImagem }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
