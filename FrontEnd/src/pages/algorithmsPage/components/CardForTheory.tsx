import React from "react";
import {Grid2, Card, CardMedia, CardContent, Typography, Divider, Box, Shadows } from "@mui/material";
import { styled } from '@mui/system';
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

interface TheoryProps {
    text: string;
  }
  
const Cards = styled(Card)<{ theme: Theme }>(({ theme }) => ({
  width: "90%",
  backgroundColor: theme.palette.background.textCard,
  borderRadius: theme.shape.cardRadius,
  boxShadow: theme.shadows[3], 
  margin: "auto",
  padding: theme.spacing(5)
}));

const TypographyForDescription = styled(Typography)(({ theme }) =>({
  fontSize: "1.2rem",
  color: theme.palette.text.primary,
  [theme.breakpoints.between(749, 950)]: {
    fontSize: "1.2rem",
  },
  [theme.breakpoints.between(600, 749)]: {
    fontSize: "1rem",
  },
}));

const CardForTheory: React.FC<TheoryProps> = ({text}) => {
  const theme = useTheme();
  return (
    <Cards>
        <Grid2>
            <TypographyForDescription>
                {text}
            </TypographyForDescription>
        </Grid2>
    </Cards>
  );
};
export default CardForTheory;