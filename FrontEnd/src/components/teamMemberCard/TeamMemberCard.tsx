import React from "react";
import styles_card from "./TeamMemberCard.module.scss";
import {Grid2, Card, CardMedia, CardContent, Typography, Divider, Box, Shadows } from "@mui/material";
import { styled } from '@mui/system';
import { Theme } from "@mui/material/styles";
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
  backgroundColor: "var(--background-color-lilac)",
  borderRadius: "20px",
  margin: "auto",
  boxShadow: theme.shadows[3], 
  flexDirection: "row",
  transition: "all 0.3s ease",
}));

const CardMediaStyled = styled(CardMedia)({
  aspectRatio: "41 / 61", 
  borderRadius: "20px"
})
const TeamMemberCard: React.FC<TeamMemberProps> = ({
  name,
  role,
  description,
  skills,
  imageUrl,
}) => {
  return (
    <Cards>
      <Grid2 container spacing={2}> 
        <Grid2 size={{ xs: 12, sm: 6 }}
          sx ={{padding: "16px"}}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={name}
            sx = {{ boxShadow: 3, aspectRatio: "41 / 61", 
              borderRadius: "20px"}}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6}}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom className={styles_card.name} >
              {name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom className={styles_card.role}
            >
              {role}
            </Typography>
            <Divider className={styles_card.divider} />
            <Typography variant="body2" className={styles_card.description}
            >
              {description}
            </Typography>
            <Typography variant="body2" className={styles_card.skills}>
              <strong>Навыки:</strong> {skills.join(", ")}
            </Typography>
          </CardContent>
        </Grid2>
      </Grid2>
    </Cards>
  );
};
export default TeamMemberCard;
