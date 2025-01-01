import React from 'react';
import styles from './header.module.scss';
import img1 from '../../assets/images/MainPage/Vector.png';
import img2 from '../../assets/images/Vector.svg'
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { mode, toggleTheme } = useTheme();
  // mui
  return (
    <header className={styles.header}>
      <img src="" alt="" className={styles.header__logo} />
      <nav>
        <a href="AboutPage">О нас</a>
        <a href="CourseContent">Содержание</a>
        <a href="#faq">Вопросы</a>
      </nav>
      <button className={styles.header__toggle} onClick={toggleTheme}>
        <img src={mode ? img2 : img1} alt="" />
      </button>
    </header>
  );
};

export default Header;
