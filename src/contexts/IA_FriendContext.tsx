import { createContext, ReactNode, useState } from 'react'
import { api } from '../services/apiClient'
import { toast } from 'react-toastify'

type IA_FriendContextData = {
  upIA: (credentials: IAProps) => Promise<void>;
  getIA: () => Promise<IAData | null>;
}

type IAProps = {
  name: string;
  sex_ia: string;
  age_average: number;
}

type IAData = {
  name: string;
  sex_ia: string;
  age_average: number;
}

type IA_FriendProviderProps = {
  children: ReactNode;
}

export const IA_FriendContext = createContext({} as IA_FriendContextData)

export function IA_FriendProvider({ children }: IA_FriendProviderProps) {
  const [loading, setLoading] = useState(false);

  async function upIA({ name, sex_ia, age_average }: IAProps) {
    try {
      setLoading(true);

      const response = await api.post('ia_friend/create', {
        name,
        sex_ia,
        age_average
      });

      toast.success('Amigo cadastrado com sucesso!');
      console.log("Friend data:", response.data);

      setLoading(false);
    } catch (err) {
      console.log('Erro ao cadastrar amigo: ', err);
      toast.error("Erro ao cadastrar amigo!");
      setLoading(false);
    }
  }

  async function getIA(): Promise<IAData | null> {
    try {
      const response = await api.get('ia_friend/getIA');
      return response.data;
    } catch (err) {
      console.log('Erro ao obter dados do amigo: ', err);
      return null;
    }
  }


  

  return (
    <IA_FriendContext.Provider value={{ upIA, getIA }}>
      {children}
    </IA_FriendContext.Provider>
  )
}
