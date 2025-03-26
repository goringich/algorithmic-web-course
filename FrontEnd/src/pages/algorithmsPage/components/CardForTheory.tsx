import React from "react";
import {Grid2, Card, Typography} from "@mui/material";
import { styled } from '@mui/system';
import { Theme } from "@mui/material/styles";

interface TheoryProps {
    text: string;
  }
  
const Cards = styled(Card)<{ theme: Theme }>(({ theme }) => ({
  width: "90%",
  backgroundColor: theme.palette.background.textCard,
  borderRadius: theme.shape.cardRadius,
  boxShadow: theme.shadows[3], 
  margin: "auto",
  marginBottom: theme.spacing(4),
  padding: theme.spacing(5)
}));

const TypographyForDescription = styled(Typography)(({ theme }) =>({
  fontSize: "1.1rem",
  color: theme.palette.text.primary,
  //whiteSpace: "pre-line",
  whiteSpace: "pre-wrap",
  [theme.breakpoints.between(600, 749)]: {
    fontSize: "1rem",
  },
}));

const CardForTheory: React.FC<TheoryProps> = ({text}) => {
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