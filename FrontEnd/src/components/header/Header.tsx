import React, { useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Grid2, Typography } from "@mui/material";
import { styled } from '@mui/system';
import { ThemeContext } from "../../context/ThemeContext";
import { useTheme } from "@mui/material/styles";

const StyledHeader = styled("header")(({ theme }) => ({
  backgroundColor: theme.palette.background.header,
  padding: theme.spacing(2, 15),
  width: "100%",
  display: "flex", 
  marginBottom: theme.spacing(0.25),
  }));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.purple.light,
    fontWeight: "bold",
    fontSize: "20px",
    textDecoration: "none"
}));  

const CenteredTitle = styled(Typography)(({ theme }) => ({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  color: theme.palette.text.primary,
  fontWeight: "bold",
  fontSize: "30px"
}));

const Header = () => {
  const theme = useTheme();
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/CourseContent": "Содержание курса",
    "/AboutPage": "О нас",
    "/FAQPage": "Частые вопросы",
  };
  
  const pageTitle = pageTitles[location.pathname];
  const isCentered = ["/CourseContent", "/AboutPage", "/FAQPage"].includes(location.pathname);

  return (
  <StyledHeader sx={{boxShadow : "2"}}>
      <StyledLink to="/">
      <Typography variant="h1" 
      style={{ color: theme.palette.purple.light, 
        fontSize: "40px",}}>
          AlgoHack
      </Typography>
      </StyledLink>

      {isCentered ? (<CenteredTitle> {pageTitle} </CenteredTitle>) : (
        <Typography
          sx={{ color: theme.palette.text.primary,
          fontWeight: "bold",
          fontSize: "20px",
          display: "flex",
          justifyContent: "flex-start"}}
        >
          {pageTitle}
        </Typography>
      )}
  </StyledHeader>
  );  
};

export default Header;