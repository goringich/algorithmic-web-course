import React, { useState, useContext } from 'react';
import person1 from '../../assets/images/MainPage/anime-person/Character&deviceForLight.png';
import person2 from '../../assets/images/MainPage/anime-person/Caracter&deviceForDark.png';
import { styled, keyframes } from "@mui/system";
import { Grid2 } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

const levitate = keyframes`
  0% { transform: translateY(-10px); }
  50% { transform: translateY(-30px); }
  100% { transform: translateY(-10px); }
`;

const AnimatedImage = styled("img")(({ theme }) => ({
  position: "absolute",
  top: "-10%", 
  left: "20%",
  zIndex: 2,
  transformOrigin: "center",
  cursor: "pointer",
  transform: "translateY(0)",
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
    <Grid2>
      <AnimatedImage sx={{maxWidth: "349px !important"}}
        src={mode === "dark"? person2 : person1}
        alt="Person sitting with a laptop"
        className={`${isHovering ? "hover" : ""} ${isAnimating ? "animating" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </Grid2>
  );
};

export default Levitate;