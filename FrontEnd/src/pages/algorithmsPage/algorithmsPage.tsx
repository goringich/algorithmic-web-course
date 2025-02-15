<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useState, useEffect } from "react";

import styles from "./algorithmsPage.module.scss";
>>>>>>> 12c56a5 (the code is brought to a logical point, all functions work, but without animations, bugs are present)
import contents from "../../assets/dataBase/TitlesData.json";
import ContentDisplay from "./components/ContentDisplay";
import Tabs, { TabType } from "./components/Tabs";
import { Section } from "./components/types/types";
import SidebarMenu from "./components/Sidebar";
import { Grid2} from "@mui/material";


const ContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("теория");
<<<<<<< HEAD
  const [activeSection, setActiveSection] = useState<Section | null>(
    contents.length > 0 ? contents[0] : null
  );
=======

  // useEffect(() => {
  //   const fetchSections = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8080/api/content");
  //       const data = await response.json();
  //       setSections(data);
  //       console.log("Данные из базы данных:", data);
  //     } catch (error) {
  //       console.error("Ошибка при получении данных:", error);
  //     }
  //   };
  //   fetchSections();
  // }, []);
>>>>>>> 64279e0 (fixed the addition bug)

  return (
    <Grid2 container sx={{ height: "100%", overflow: "hidden" }}>
      <Grid2 size={{md: 3}} sx={{
        height: "calc(100vh - 65px)", 
        top: "1px", // Начинается сразу под хэдером
        overflowY: "auto",
        boxShadow: 2,
      }}>
        <SidebarMenu />
      </Grid2>

      <Grid2 size={{md: 9}}
          component="main" sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            height: "calc(100vh - 65px)", 
            '&::-webkit-scrollbar': {
            display: 'none',  // Скрыть полосу прокрутки
          },
          }}>
          <ContentDisplay activeSection={activeSection} activeTab={activeTab} />
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      </Grid2>
    </Grid2>
  );
};

export default ContentPage;
