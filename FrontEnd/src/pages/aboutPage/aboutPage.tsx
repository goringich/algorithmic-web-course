import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import styles from "./aboutPage.module.scss";
import TeamMemberCard from "../../components/teamMemberCard/TeamMemberCard";
import { Grid2, Button } from "@mui/material";
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
    <Grid2 container
    className={styles.about_page_container}
    >
      <Grid2>
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1}
          //className={styles.size}
        >
          {teamMembers.map((member, index) => (
            <SwiperSlide key={index} style={{ paddingBottom: '16px' }}>
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
      </Grid2>

      <Grid2 size={{ xs: 10, sm: 6, lg: 5, xl: 3 }}>
        <Button 
          variant="contained"
          color="primary"
          className={styles.contact_button}
        >
          Связаться с нами
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default AboutPage;
