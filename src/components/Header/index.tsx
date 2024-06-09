import { useContext, useState, useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';
import Image from 'next/image';

export function Header() {
  const { user, signOut } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log(user?.name)
  console.log(user?.photo)
  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
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

          <div
            className={styles.profileContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={dropdownRef}
          >
            <Image
              src={user?.photo || '/photoDefault.png'}
              alt="User Photo"
              className={styles.profilePhoto}
              width={50}
              height={50}
            />
            <span>{user?.name}</span>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link href="/me">My Profile</Link>
                <Link href="/settings">Settings</Link>
                <button onClick={signOut}>
                  Logout
                </button>
              </div>
            )}
          </div>

          <button onClick={signOut}>
            <FiLogOut color="#FFF" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
