import React from "react";

import {Grid2, Card, CardMedia, CardContent, Typography, Divider, Box, Shadows } from "@mui/material";
import { styled } from '@mui/system';
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  skills: string[];
  imageUrl: string;
}

const Cards = styled(Card)<{ theme: Theme }>(({ theme }) => ({
  width: "80vw",
  maxWidth: "987px",
  backgroundColor: theme.palette.background.card,
  borderRadius: theme.shape.cardRadius,
  margin: "auto",
  boxShadow: theme.shadows[3], 
}));

const TypographyForDescription = styled(Typography)(({ theme }) =>({
  fontSize: "1.6rem",
  color: theme.palette.text.primary,
  [theme.breakpoints.between(749, 950)]: {
    fontSize: "1.2rem",
  },
  [theme.breakpoints.between(600, 749)]: {
    fontSize: "1rem",
  },
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: "1.9rem",
  fontWeight: "bold", 
  textAlign: "center", 
  color: theme.palette.text.primary,
  [theme.breakpoints.between(749, 950)]: {
    fontSize: "1.4rem",
  },
  [theme.breakpoints.between(600, 749)]: {
    fontSize: "1.2rem",
  },
}))

const TeamMemberCard: React.FC<TeamMemberProps> = ({
  name,
  role,
  description,
  skills,
  imageUrl, 
}) => {
  const theme = useTheme();
  return (

    <Cards>
      <Grid2 container spacing={2}> 
        <Grid2 size={{ xs: 12, sm: 6 }}
          sx ={{padding: theme.spacing(4)}}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={name}
            sx = {{ boxShadow: 3, aspectRatio: "41 / 61", 
              borderRadius: theme.shape.cardRadius}}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6}}>
          <CardContent>
            <TitleTypography>
              {name}
            </TitleTypography>
            <TypographyForDescription
            sx = {{textAlign: "center", fontStyle: "italic"}}>
              {role}
            </TypographyForDescription>
            <Divider sx ={{borderBottomWidth: "2px", borderColor: theme.palette.text.primary}} />
            <TypographyForDescription
            >
              {description}
            </TypographyForDescription>
            <TypographyForDescription>
              <strong>Навыки:</strong> {skills.join(", ")}
            </TypographyForDescription>
          </CardContent>
        </Grid2>
      </Grid2>
    </Cards>
  );
};
export default TeamMemberCard;