import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import TeamMemberCard from "../../components/teamMemberCard/TeamMemberCard";
import { Grid2, Button } from "@mui/material";
import photo_Juls from "../../assets/images/AboutPage/image_juls.jpg";
import photo_Nastik from "../../assets/images/AboutPage/image_nastik.jpg";
import photo_igor from "../../assets/images/AboutPage/image_igor.jpg";
import photo_ksenon from "../../assets/images/AboutPage/image_ksenon.jpg";
import { styled } from '@mui/system';

const teamMembers = [
  {
    name: "Юлия Чезрякова",
    role: "Team leader",
    description:
      "Студент 2-го курса НИУ ВШЭ 'Компьютерные науки и технологии'. Призер международного фестиваля хакатонов 'Технострелка'.",
    skills: ["C/C++", "Python", "Java", "SQL", "Figma"],
    imageUrl: photo_Juls,
  },
  {
    name: "Анастасия Пищаева",
    role: "Frontend Developer",
    description:
      "Студент 2-го курса НИУ ВШЭ 'Компьютерные науки и технологии'",
    skills: ["C/C++", "Python", "Figma", "C#", "JS", "React" ],
    imageUrl: photo_Nastik,
  },
  {
    name: "Игорь Ким",
    role: "Fullstack Developer",
    description:
      "Студент 2-го курса НИУ ВШЭ 'Компьютерные науки и технологии'",
    skills: ["JS/TS, React & Ecosystem, PixiJS/react-pixi, react-konva, Framer Motion, axios, WebSocket, WebAssembly, Vite, Webpack, Gulp, WP, jQuery, Go(Gin), Python (Flask), PostgreSQL"],
    imageUrl: photo_igor,
  },
  {
    name: "Ксения Игонина",
    role: "Какой-то Developer",
    description:
      "Студент 2-го курса НИУ ВШЭ 'Компьютерные науки и технологии'",
    skills: ["C/C++", "Python", "Java", "UnitTests", "SQL"],
    imageUrl: photo_ksenon,
  },
];

const AboutPageContainer = styled(Grid2)(({ theme }) =>({
  justifyContent: "center",
  marginTop: theme.spacing(6)
}))

const ContactButton = styled(Button)(({ theme }) =>({
  backgroundColor: theme.palette.purple.light,
  color: theme.palette.text.white,
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  marginBottom: theme.spacing(4)
}))

const StyledSwiper = styled(Swiper)(({ theme }) =>({
  "& .swiper-button-next, & .swiper-button-prev": {
    color: theme.palette.text.primary,
    width: "6%",
  },
}))

const AboutPage: React.FC = () => {
  return (
    <AboutPageContainer container
    >
      <Grid2>
        <StyledSwiper
          modules={[Navigation]}
          navigation
          slidesPerView={1}
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
        </StyledSwiper>
      </Grid2>

      <Grid2 size={{ xs: 10, sm: 6, lg: 5, xl: 3 }}>
        <ContactButton 
          variant="contained"
          color="primary"
        >
          Связаться с нами
        </ContactButton>
      </Grid2>
    </AboutPageContainer>
  );
};

export default AboutPage;
