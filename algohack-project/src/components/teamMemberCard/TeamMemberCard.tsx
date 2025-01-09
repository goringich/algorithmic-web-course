import React from "react";
import styles_aboutPage from "./TeamMemberCard.module.scss";
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
    <Card
      sx={{
        display: "flex",
        width: 987, // Задаем фиксированную ширину карточки
        height: 761, // Задаем фиксированную высоту карточки
        backgroundColor: "#EADDFF",
        borderRadius: 4,
        boxShadow: 3,
        margin: "auto", // Центрируем карточку
      }}
    >
      {/* Левая часть с изображением */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={name}
        sx={{
          width: 451, // Фиксированная ширина изображения
          height: 671, // Фиксированная высота изображения
          margin: "auto 0", // Вертикальное выравнивание изображения
          marginLeft: "44px", // Фиксированный отступ слева
          display: "flex",
        }}
      />
      {/* Правая часть с текстом */}
      <Box 
        sx={{
          flex: 1,
          padding: 3,
          display: "flex",
          marginTop: "40px",
          flexDirection: "column",
          justifyContent: "space-between"
        }} 
      >
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom className={styles_aboutPage.name} >
            {name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom className={styles_aboutPage.role}
          >
            {role}
          </Typography>
          <Divider sx={{ marginY: 2, borderBottomWidth: 2, borderColor: "black" }} />
          <Typography variant="body2" paragraph className={styles_aboutPage.description}
          >
            {description}
          </Typography>
          <Typography variant="body2" className={styles_aboutPage.skills}>
            <strong>Навыки:</strong> {skills.join(", ")}
          </Typography>
        </CardContent>
        {/* Кнопка */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
          <Button variant="contained" color="primary">
            Связаться с нами
          </Button>
        </Box>
      </Box>
    </Card>
  );
};
export default TeamMemberCard;
