import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import styles from "./aboutPage.module.scss";
import TeamMemberCard from "../../components/teamMemberCard/TeamMemberCard";
import { Button } from "@mui/material";
import photo_Juls from "../../assets/images/AboutPage/image_juls.jpg";
import photo_Nastik from "../../assets/images/AboutPage/image_nastik.jpg";
import photo_igor from "../../assets/images/AboutPage/image_igor.jpg";
import photo_ksenon from "../../assets/images/AboutPage/image_ksenon.jpg";


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
    <div className="about-page-container"
    >
      <div className="swiper-container"
      >
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={1}
          className="size"
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

      <div className="button-container"
      >
        <Button
          variant="contained"
          color="primary"
          className="contact-button"
        >
          Связаться с нами
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;
