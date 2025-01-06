import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import TeamMemberCard from "../components/teamMemberCard/TeamMemberCard";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  skills: string[];
  imageUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Чезрякова Юлия",
    role: "Team leader",
    description:
      "Студентка 2-го курса НИУ ВШЭ 'Компьютерные науки и технологии'. Призер международного фестиваля хакатонов 'Технострелка'.",
    skills: ["C/C++", "Python", "Java", "SQL", "Figma"],
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    name: "Иванов Иван",
    role: "Backend Developer",
    description:
      "Студент 3-го курса НИУ ВШЭ 'Информатика и программирование'. Участник международных хакатонов.",
    skills: ["Node.js", "Express", "MongoDB", "Python"],
    imageUrl: "https://via.placeholder.com/150",
  },
];

const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Наша команда
      </Typography>
      <Box sx={{ marginY: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TeamMemberCard
                name={member.name}
                role={member.role}
                description={member.description}
                skills={member.skills}
                imageUrl={member.imageUrl}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutPage;
