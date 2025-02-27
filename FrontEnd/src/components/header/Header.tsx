import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Grid2, Typography } from "@mui/material";
import { styled } from '@mui/system';
import { ThemeContext } from "../../context/ThemeContext";
import { useTheme } from "@mui/material/styles";
import { useLocation } from 'react-router-dom';

const StyledHeader = styled("header")(({ theme, marginBottom }: any) => ({
    backgroundColor: theme.palette.background.header,
    padding: theme.spacing(2, 15),
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: marginBottom || theme.spacing(4), 
  }));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.purple.light,
    fontWeight: "bold",
    fontSize: "20px",
    textDecoration: "none"
}));

const Header = () => {
  const location = useLocation();
  const theme = useTheme();
  const isSpecificPage = location.pathname === '/algorithmsPage';
  return (
  <StyledHeader marginBottom={isSpecificPage ? 1 : undefined} sx={{boxShadow : "2"}}>
    <Grid2>
        <StyledLink to="/">
        <Typography variant="h1" 
        style={{ color: theme.palette.purple.light, 
         fontSize: "40px",}}>
            AlgoHack
        </Typography>
        </StyledLink>
    </Grid2>
  </StyledHeader>
  );  
};

export default Header;