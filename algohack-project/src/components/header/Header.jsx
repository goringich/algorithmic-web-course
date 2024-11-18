import React from 'react';
import styles from './header.module.scss';
import img1 from '../../assets/images/MainPage/Vector.png'
// import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  // const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <img src="" alt="" className={styles.header__logo} />
      <nav>
        <a href="#about">О нас</a>
        <a href="#content">Содержание</a>
        <a href="#faq">Вопросы</a>
      </nav>
      {/* <button onClick={toggleTheme}>
        {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
      </button> */}
      <button className={styles.header__toggle} >
        <img src={img1} alt="" />
      </button>
    </header>
  );
};

export default Header;
