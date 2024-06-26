import { createContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/apiClient';
import { parseCookies } from 'nookies';
import Router from 'next/router';
import { toast } from 'react-toastify';

type UserContextData = {
  upUser: (credentials: UserProps, photo: File | null) => Promise<void>;
  getUser: () => Promise<UserProps | null>;
  removePhoto: () => void;
};

export type UserProps = {
  id?: string;
  name: string;
  social_name?: string;
  year: number;
  email: string;
  sex: string;
  region: string;
  photo?: string;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  async function getUser(): Promise<UserProps | null> {
    try {
      const response = await api.get('user/me');
      setUserPhoto(response.data.photo);
      return response.data;
    } catch (err) {
      console.log('Erro ao obter dados do amigo: ', err);
      return null;
    }
  }

  async function upUser({ name, social_name, year, email, sex, region }: UserProps, photo: File | null) {
    try {
      const response = await api.put('/user/update', {
        name,
        social_name,
        year,
        email,
        sex,
        region
      });

      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);

        await api.post('/user/upsert_photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      toast.success('Conta atualizada com sucesso!');
      Router.push('/home');
    } catch (err) {
      console.log('Erro ao atualizar: ', err);
      toast.error("Erro ao atualizar!");
    }
  }

  function removePhoto() {
    setUserPhoto(null);
  }

  return (
    <UserContext.Provider value={{ upUser, getUser, removePhoto }}>
      {children}
    </UserContext.Provider>
  );
}
