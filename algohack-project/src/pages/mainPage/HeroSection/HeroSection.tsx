import React from 'react';
import styles from './HeroSection.module.scss';
import Levitate from "../../../components/levitate/Levitate"
import table from '../../../assets/images/MainPage/anime-person/Group 3490.png';


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
