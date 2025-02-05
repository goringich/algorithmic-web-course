import React from "react";
<<<<<<< HEAD
import {Grid2, Card, CardMedia, CardContent, Typography, Divider, Box, Shadows } from "@mui/material";
import { styled } from '@mui/system';
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
=======
import styles_card from "./TeamMemberCard.module.scss";
import { Grid2, Card, CardMedia, CardContent, Typography, Divider, Box, Shadows } from "@mui/material";

>>>>>>> 848d33b (fixed types of props in each component)
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
<<<<<<< HEAD
    <Cards>
      <Grid2 container spacing={2}> 
        <Grid2 size={{ xs: 12, sm: 6 }}
          sx ={{padding: theme.spacing(4)}}
        >
=======
    <Card className={styles_card.card_style} 
    sx = {{ boxShadow: 3}}
    >
      <Grid2 container columns={12} spacing={2}>
        <Grid2 gridColumn={{ xs: "span 6", sm: "span 6" }} className={styles_card.left_part}>
>>>>>>> 848d33b (fixed types of props in each component)
          <CardMedia
            component="img"
            image={imageUrl}
            alt={name}
<<<<<<< HEAD
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
=======
            sx={{ boxShadow: 3 }}
            className={styles_card.photo}
          />
        </Grid2>

        <Grid2 gridColumn={{ xs: "span 12", sm: "span 6" }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom className={styles_card.name}>
              {name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom className={styles_card.role}>
              {role}
            </Typography>
            <Divider className={styles_card.divider} />
            <Typography variant="body2" paragraph className={styles_card.description}>
              {description}
            </Typography>
            <Typography variant="body2" className={styles_card.skills}>
              <strong>Навыки:</strong> {skills.join(", ")}
            </Typography>
          </CardContent>
        </Grid2>
      </Grid2>
    </Card>
>>>>>>> 848d33b (fixed types of props in each component)
  );
};
export default TeamMemberCard;