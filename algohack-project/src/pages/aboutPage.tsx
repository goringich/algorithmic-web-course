import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "./AboutPage.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import TeamMemberCard from "../components/teamMemberCard/TeamMemberCard";
import { Container } from "@mui/material";

const teamMembers = [
  {
    name: "Чезрякова Юлия",
    role: "Team leader",
    description:
      "Студентка 2-го курса НИУ ВШЭ 'Компьютерные науки и технологии'. Призер международного фестиваля хакатонов 'Технострелка'.",
    skills: ["C/C++", "Python", "Java", "SQL", "Figma"],
    imageUrl: "https://via.placeholder.com/451x671",
  },
  {
    name: "Иван Иванов",
    role: "Backend Developer",
    description:
      "Студент 3-го курса НИУ ВШЭ. Разрабатывает серверные приложения и микросервисы.",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    imageUrl: "https://via.placeholder.com/451x671",
  },
];

const AboutPage: React.FC = () => {
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 0",
      }}
    >
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        style={{
          width: 1200,
          height: 780,
          marginBottom: "4px",
        }}
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
      <div
        style={{
          marginTop: "0px",
          textAlign: "center",
        }}
      >
      </div>
    </Container>
  );
};

export default AboutPage;
