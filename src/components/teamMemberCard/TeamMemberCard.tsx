import React from "react";
import styles_card from "./TeamMemberCard.module.scss";
import { Grid2, Card, CardMedia, CardContent, Typography, Divider, Box, Shadows } from "@mui/material";

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  skills: string[];
  imageUrl: string;
}

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
      <Grid2 container>
        <Grid2 item 
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
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

        <Grid2 item  className={styles_card.right_part}>
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
