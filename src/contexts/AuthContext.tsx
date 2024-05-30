import {createContext, ReactNode, useState} from 'react'
import {api} from '../services/apiClient'

import {destroyCookie, setCookie, parseCookies} from 'nookies'
import Router from 'next/router'

type AuthContextData = {
    user: UserProps | undefined;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    }catch{
        console.log('Erro ao deslogar')
    }
}

export function AuthProvider({children} : AuthProviderProps){
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user; //!! quer dizer que vai converter para bool

    async function signIn({email, password}:SignInProps){
        try{
            const response = await api.post('/user/session',{
                email,
                password
            })
            //console.log(response.data);

            const {id, name, token} = response.data

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60*60*24*30, //expirar em 1 mês
                path: '/'//quais caminhos tem acesso, no caso todos
            })
            setUser({
                id,
                name,
                email
            })

            //passar para proximas o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            //redirecionar a dashboard
            Router.push('/home')
        }
        catch(err){
            console.log('Erro ao acessar ',err)
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

