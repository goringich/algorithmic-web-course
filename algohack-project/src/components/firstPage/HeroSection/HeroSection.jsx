import React, { useState } from 'react';
import styles from './HeroSection.module.scss';
import person from '../../../assets/images/MainPage/anime-person/Character&device.png';
import table from '../../../assets/images/MainPage/anime-person/Group 3490.png';

const Levitate = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setTimeout(() => setIsAnimating(true), 500);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setIsAnimating(false), 500);
    setIsHovering(false);
  };

  return (
    <img
      className={`
        ${styles.image__person} 
        ${styles.levitate} 
        ${isHovering ? styles.hover : ''} 
        ${isAnimating ? styles.animating : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      src={person}
      alt="Person sitting with a laptop"
    />
  );
};
const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>
          Interactive Web Course <span className={styles.brand}>AlgoHack</span>
        </h1>
        <p>
          AlgoHack - это интерактивный веб-курс с визуализацией, комплексным анализом и
          углубленным аналитическим исследованием алгоритмов, который не только
          предоставляет теоретические знания, но и активно вовлекает пользователей в процесс
          обучения через интерактивные элементы и визуальные представления.
        </p>
        <button className={styles.button}>Начать →</button>
      </div>
      <div className={styles.image}>
        <Levitate />
        <img className={styles.image__table} src={table} alt="Table illustration" />
      </div>
    </section>
  );
};

export default HeroSection;
