import React from "react";
import { Typography, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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
  {
    name: "Смирнова Анна",
    role: "Frontend Developer",
    description:
      "Студентка 2-го курса НИУ ВШЭ 'Программная инженерия'. Участник международных соревнований по веб-разработке.",
    skills: ["React", "JavaScript", "TypeScript", "CSS"],
    imageUrl: "https://via.placeholder.com/150",
  },
];

const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ paddingY: 4 }}>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        style={{ marginTop: 20 }}
      >
        {teamMembers.map((member, index) => (
          <SwiperSlide key={index}>
            <TeamMemberCard
              name={member.name}
              role={member.role}
              description={member.description}
              skills={member.skills}
              imageUrl={member.imageUrl}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default AboutPage;
