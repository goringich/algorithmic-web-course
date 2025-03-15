import React, { useState, useContext } from 'react';
import person1 from '../../assets/images/MainPage/anime-person/Character&deviceForLight.png';
import person2 from '../../assets/images/MainPage/anime-person/Caracter&deviceForDark.png';
import { styled, keyframes } from "@mui/system";
import { ThemeContext } from "../../context/ThemeContext";
const levitate = keyframes`
  0% { transform: translateY(-10px); }
  50% { transform: translateY(-30px); }
  100% { transform: translateY(-10px); }
`;

const AnimatedImage = styled("img")(({ theme }) => ({
  position: "absolute",
  left: "20%",
  width: "60% !important", 
  zIndex: 2,
  transition: "transform 0.5s linear",
  animation: "none",
  "&.hover": {
    transform: "translateY(-10px)",
  },
  "&.animating": {
    animation: `${levitate} 3s ease-in-out infinite`,
  },
}));

const Levitate = () => {
  const { mode } = useContext(ThemeContext);

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
    <AnimatedImage
      src={mode === "dark"? person2 : person1}
      alt="Person sitting with a laptop"
      className={`${isHovering ? "hover" : ""} ${isAnimating ? "animating" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default Levitate;