import React from "react";
import "swiper/css"; 
import "swiper/css/navigation"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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
    name: "Чезрякова Юлия",
    role: "Team leader",
    description:
      "Студентка 2-го курса НИУ ВШЭ 'Компьютерные науки и технологии'. Призер международного фестиваля хакатонов 'Технострелка'.",
    skills: ["C/C++", "Python", "Java", "SQL", "Figma"],
    imageUrl: "https://via.placeholder.com/150",
  }
];

const AboutPage: React.FC = () => {
  return (
    <div className="team-section-slider">
      <Swiper
        modules={[Navigation]}
        navigation // Включаем только стрелки навигации
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
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
  );
};

export default AboutPage;
