import { useContext  } from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'

import { FiLogOut } from 'react-icons/fi'

import { AuthContext } from '../../contexts/AuthContext'

export function Header(){

  const { signOut } = useContext(AuthContext)

  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/home">
            <img src="/vercel.svg" width={190} height={60} />
        </Link>

        <nav className={styles.menuNav}>
          <Link href="/ia_friend">
            IA_Friend
          </Link>

          <Link href="/about">
            Sobre nós
          </Link>

          <button onClick={signOut}>
            <FiLogOut color="#FFF" size={24} />
          </button>
        </nav>

      </div>
    </header>
  )
}