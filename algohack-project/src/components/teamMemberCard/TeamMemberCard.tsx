import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Divider, Box } from "@mui/material";

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
    <Card sx={{ maxWidth: 345, borderRadius: 4, boxShadow: 3, overflow: 'hidden' }}>
      {/* Image */}
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={name}
      />
      {/* Content */}
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {role}
        </Typography>
        <Divider sx={{ marginY: 1 }} />
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Typography variant="body2" color="text.primary">
          <strong>Навыки:</strong> {skills.join(", ")}
        </Typography>
      </CardContent>
      {/* Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <Button variant="contained" color="primary">
          Связаться с нами
        </Button>
      </Box>
    </Card>
  );
};

export default TeamMemberCard;
