import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "./AboutPage.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import TeamMemberCard from "../components/teamMemberCard/TeamMemberCard";
import { Button } from "@mui/material";
import photo_Juls from "../assets/images/AboutPage/image_juls.jpg";
import photo_Nastik from "../assets/images/AboutPage/image_nastik.jpg";
import photo_igor from "../assets/images/AboutPage/image_igor.jpg";
import photo_ksenon from "../assets/images/AboutPage/image_ksenon.jpg";


const teamMembers = [
  {
    name: "Юлия Чезрякова",
    role: "Team leader",
    description:
      "Студентка 2-го курса НИУ ВШЭ 'Компьютерные науки и технологии'. Призер международного фестиваля хакатонов 'Технострелка'.",
    skills: ["C/C++", "Python", "Java", "SQL", "Figma"],
    imageUrl: photo_Juls,
  },
  {
    name: "Анастасия Пищаева",
    role: "Frontend Developer",
    description:
      "Студент 2-го курса НИУ ВШЭ.",
    skills: ["C/C++", "Python", "Figma", "C#"],
    imageUrl: photo_Nastik,
  },
  {
    name: "Игорь Ким",
    role: "Fullstack Developer",
    description:
      "Студент 2-го курса НИУ ВШЭ.",
    skills: ["C/C++", "Python", "и тд допишите, ибо я не знаю:)"],
    imageUrl: photo_igor,
  },
  {
    name: "Ксения Игонина",
    role: "Какой-то Developer",
    description:
      "Студент 2-го курса НИУ ВШЭ.",
    skills: ["C/C++", "Python", "и тд допишите, ибо я не знаю:)"],
    imageUrl: photo_ksenon,
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
            borderRadius: "7px",
          }}
        >
          Связаться с нами
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;
