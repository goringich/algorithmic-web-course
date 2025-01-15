import React from "react";
import styles_card from "./TeamMemberCard.module.scss";
import { Card, CardMedia, CardContent, Typography, Divider, Box, Shadows } from "@mui/material";

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
      <CardMedia
        component="img"
        image={imageUrl}
        alt={name}
        sx = {{ boxShadow: 3}}
        className={styles_card.left_part}
      />

      <Box className={styles_card.right_part}
      sx = {{padding: 3}}
      >
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
      </Box>
    </Card>
  );
};
export default TeamMemberCard;
