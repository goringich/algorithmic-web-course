import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "./AboutPage.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import TeamMemberCard from "../components/teamMemberCard/TeamMemberCard";
import { Button } from "@mui/material";
import photo_Juls from "../assets/images/AboutPage/image.jpg";

const teamMembers = [
  {
    name: "Чезрякова Юлия",
    role: "Team leader",
    description:
      "Студентка 2-го курса НИУ ВШЭ 'Компьютерные науки и технологии'. Призер международного фестиваля хакатонов 'Технострелка'.",
    skills: ["C/C++", "Python", "Java", "SQL", "Figma"],
    imageUrl: photo_Juls,
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
    <div
      style={{
        position: "relative", // Для размещения кнопки внутри этого контейнера
        width: "100%",
        height: "100vh", // Высота на всю страницу
        display: "flex",
        justifyContent: "center", // Центрирование карточки по горизонтали
        alignItems: "center", // Центрирование карточки по вертикали
      }}
    >
      {/* Контейнер с карточкой */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "1200px",
          height: "780px",
          zIndex: 1, // Задаем базовый слой
        }}
      >
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={1}
          style={{
            width: "100%",
            height: "100%",
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
      </div>

      {/* Контейнер с кнопкой */}
      <div
        style={{
          position: "absolute", // Позиционируем относительно родительского div
          right: "20px", // Расстояние от правого края
          top: "50%", // Располагаем по центру
          transform: "translateY(700%)", // Смещаем вниз от центра
          zIndex: 2, // Поверх всех других слоев
        }}
      >
        <Button
          variant="contained"
          color="primary"
          style={{
            padding: "10px 20px",
            backgroundColor: "#B13EEA",
            color: "#fff",
            textTransform: "none",
            fontFamily: "Comfortaa, sans-serif",
          }}
        >
          Связаться с нами
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;
