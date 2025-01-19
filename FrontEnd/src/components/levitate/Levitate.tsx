import React, { useState } from 'react';
import styles1 from './Levitate.module.scss';
import styles2 from '../../pages/mainPage/HeroSection/HeroSection.module.scss';
import person from '../../assets/images/MainPage/anime-person/Character&device.png';

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
        ${styles2.image__person} 
        ${styles1.levitate} 
        ${isHovering ? styles1.hover : ''} 
        ${isAnimating ? styles1.animating : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      src={person}
      alt="Person sitting with a laptop"
    />
  );
};

export default Levitate;