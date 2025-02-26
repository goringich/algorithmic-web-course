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
  width: "100%",
  display: "flex",
  justifyContent: "space-between"
}));

const StyledNav = styled("nav")({
  display: "flex",
});

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginRight: "60px",
  fontWeight: 500,
  fontSize: "20px",
  display: "flex",
  alignItems: "center",

  "&:hover": {
    textDecoration: "underline",
  }
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
        <StyledLink sx = {{marginRight: "10px"}} to="#faq">Вопросы</StyledLink>
      </StyledNav>
      
      <ThemeButton onClick={toggleTheme}>
        <img src={mode === "dark"? img2 : img1} alt="Переключение темы" />
      </ThemeButton>
    </StyledHeader>
  );  
};

export default Header;
