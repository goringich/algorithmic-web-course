import React, {useContext} from 'react';
import { Link } from "react-router-dom";
import Levitate from "../../../components/levitate/Levitate"
import table from '../../../assets/images/MainPage/anime-person/Group 3490.png';
import { Grid2, Button } from "@mui/material";
import { styled } from '@mui/system';
import { useTheme } from "@mui/material/styles";
import { Typography, Box } from '@mui/material';
import { ThemeContext } from "../../../context/ThemeContext";

const ImageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "relative",
  maxWidth: "650px",
  width: "100%",
  height: "100%",
  textAlign: "right",
  alignItems: "center",
  "& img": {
    maxWidth: "100%",
    width: "100%", 
    height: "auto",
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  display: "inline-block",
  marginTop: "20px",
  padding: theme.spacing(3, 8),
  backgroundColor: theme.palette.purple.light,
  color: theme.palette.text.white
}))

const HeroSection = () => {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);
  return (
    <Grid2 container spacing={20} sx={{padding: theme.spacing(10, 25)}}>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Typography variant = "h1">
          Interactive Web Course{" "}
          <span
            style={{
              color: theme.palette.purple.light,
            }}
          >
            AlgoHack
          </span>
        </Typography>
        <Typography sx={{color : theme.palette.text.primary, opacity: "0.6"}}>
          AlgoHack - это интерактивный веб-курс с визуализацией, комплексным анализом и
          углубленным аналитическим исследованием алгоритмов, который не только
          предоставляет теоретические знания, но и активно вовлекает пользователей в процесс
          обучения через интерактивные элементы и визуальные представления.
        </Typography>
        <StartButton sx={{boxShadow : 3}} >
          <Link to="/algorithmsPage/Algorithm-1">
          Начать →
          </Link>
        </StartButton>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <ImageContainer>
          <img style ={{zIndex: 1}} src={table} alt="Table illustration" />
          <Levitate/>
        </ImageContainer> 
      </Grid2>
    </Grid2>
  );
};

export default HeroSection;
