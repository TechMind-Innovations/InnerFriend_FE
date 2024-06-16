import { createContext, ReactNode, useState, useEffect } from 'react'
import { api } from '../services/apiClient'

import { parseCookies } from 'nookies'
import Router from 'next/router'

import { toast } from 'react-toastify'

type UserContextData = {
    upUser: (credentials: UserProps) => Promise<void>;
    getUser: () => Promise<UserProps | null>;
}

type UserProps = {
    id?: string;
    name: string;
    social_name?: string;
    year: number;
    email: string;
    sex: string;
    region: string;
    photo?: string;
}

type UserProviderProps = {
    children: ReactNode;
}

export const UserContext = createContext({} as UserContextData)

export function UserProvider({ children }: UserProviderProps) {

    async function getUser(): Promise<UserProps | null> {
        try {
          const response = await api.get('user/me');
          return response.data;
        } catch (err) {
          console.log('Erro ao obter dados do amigo: ', err);
          return null;
        }
      }

    async function upUser({ name, social_name, year, email, sex, region, photo }: UserProps) {
        try {
            const response = await api.post('/user/create', {
                name,
                social_name,
                year,
                email,
                sex,
                region
            })
            const response2 = await api.post('/user/upsert_photo', {
                photo
            })
            toast.success('Conta atualizada com sucesso!')


            Router.push('/home')
        }
        catch (err) {
            console.log('Erro ao atualizar: ', err)
            toast.error("Erro ao atualizar!")
        }
    }

    return (
        <UserContext.Provider value={{ upUser, getUser }}>
            {children}
        </UserContext.Provider>
    )
}
