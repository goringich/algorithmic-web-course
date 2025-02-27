import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Grid2, IconButton } from "@mui/material";
import img1 from '../../assets/images/MainPage/Vector.png';
import img2 from '../../assets/images/Vector.svg'
import logo_dark from '../../assets/images/MainPage/logo_dark.jpg';
import logo_light from '../../assets/images/MainPage/logo_light.jpg';
import { styled } from '@mui/system';
import { ThemeContext } from "../../context/ThemeContext";

const StyledHeader = styled("header")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4, 15),
  display: "flex",
  justifyContent: "space-between"
}));

const StyledNav = styled("nav")({
  display: "flex",
});

const StyledLink = styled(Link)(({ theme }) => ({
  position: "relative", // Обеспечиваем возможность использования псевдоэлемента
  color: theme.palette.text.primary,
  marginRight: "60px",
  fontWeight: 500,
  fontSize: "20px",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",

  "&::after": {
    content: '""', 
    position: "absolute",
    left: "50%", 
    bottom: 0, 
    width: 0, 
    height: "2px", 
    background: theme.palette.text.primary, 
    transition: "width 0.5s ease, left 0.5s ease", 
    },

  "&:hover::after": {
    width: "100%", 
    left: "0", 
  },
}));

const ThemeButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.text.primary,
  width: "35px",
  height: "35px",
}))


const Header = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  return (
    <StyledHeader>
      <Grid2 component="img"
      src={mode === "dark"? logo_dark : logo_light} alt=""
      sx={{
        width: { xs: "50px", sm: "70px", md: "90px" },
        height: "auto",
      }}
      />
      <StyledNav>
        <StyledLink sx = {{marginLeft: "10px"}}to="/AboutPage">О нас</StyledLink>
        <StyledLink to="/CourseContent">Содержание</StyledLink>
        <StyledLink sx = {{marginRight: "10px"}} to="/FAQPage">Вопросы</StyledLink>
      </StyledNav>
      
      <ThemeButton onClick={toggleTheme}>
        <img src={mode === "dark"? img2 : img1} alt="Переключение темы" />
      </ThemeButton>
    </StyledHeader>
  );  
};

export default Header;
