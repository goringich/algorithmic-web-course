import React, { useState, useEffect } from "react";
import contents from "../../assets/dataBase/TitlesData.json";
import styles from "./algorithmsPage.module.scss";
import Sidebar from "./components/Sidebar";
import ContentDisplay from "./components/ContentDisplay";
import Tabs, { TabType } from "./components/Tabs";
import { Section } from "./components/types/types";
import {Grid2} from "@mui/material";
import SidebarMenu from "./components/Sidebar";

const ContentPage: React.FC = () => {

  return (
    <Grid2 container>
      <Grid2 sx={{ flex: 1 }}>
        {/*основной контент здесь */}
      </Grid2>

      <Grid2
        sx={{
          position: "fixed",  // Фиксируем меню слева
          top: 0,  // Верхняя граница меню
          bottom: 0,  // Нижняя граница меню
          overflowY: "auto",  // Прокрутка только внутри менюч
          boxShadow: "2",
          '&::-webkit-scrollbar': {
            display: 'none',  // Скрыть полосу прокрутки
          },
        }}
      >
        <SidebarMenu/>
      </Grid2>
    </Grid2>

  // useEffect(() => {
  //   const fetchSections = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8081/api/sections");
  //       const data = await response.json();
  //       console.log("Темы из API:", data);

  //       if (Array.isArray(data)) {
  //         setSections(data); // Убеждаемся, что сохраняем массив
  //       } else {
  //         console.error("API вернул не массив:", data);
  //         setSections([]); // Если данные некорректные, подставляем пустой массив
  //       }
  //     } catch (error) {
  //       console.error("Ошибка при получении данных:", error);
  //       setSections([]); // Если ошибка — ставим пустой массив, чтобы избежать `undefined`
  //     }
  //   };

  //   fetchSections();
  // }, []);

  // return (
  //   <div className={styles.content_page}>
  //     <Sidebar contents={sections} onSectionSelect={(section) => setActiveSection(section)} />
  //     <main className={styles.main}>
  //       <ContentDisplay activeSection={activeSection} activeTab={activeTab} />
  //       <Tabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
  //     </main>
  //   </div>
  );
};

export default ContentPage;
