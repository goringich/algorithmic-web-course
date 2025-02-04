import React from "react";
import styles_card from "./TeamMemberCard.module.scss";
import {Grid2, Card, CardMedia, CardContent, Typography, Divider, Box, Shadows } from "@mui/material";

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  skills: string[];
  imageUrl: string;
}
const isMobile = window.matchMedia("(max-width: 599px)").matches;
const TeamMemberCard: React.FC<TeamMemberProps> = ({
  name,
  role,
  description,
  skills,
  imageUrl,
}) => {
  return (
    <Card className={styles_card.card_style} 
    sx = {{ boxShadow: 3}}
    >
      <Grid2 container spacing={2}> 
        <Grid2 size={{ xs: 12, sm: 6 }}
          // sx={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
          className={styles_card.left_part}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={name}
            sx = {{ boxShadow: 3}}
            className={styles_card.photo}
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
            <Typography variant="body2" paragraph className={styles_card.description}
            >
              {description}
            </Typography>
            <Typography variant="body2" className={styles_card.skills}>
              <strong>Навыки:</strong> {skills.join(", ")}
            </Typography>
          </CardContent>
        </Grid2>
      </Grid2>
    </Card>
  );
};
export default TeamMemberCard;
