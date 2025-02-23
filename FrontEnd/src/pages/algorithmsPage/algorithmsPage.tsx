import React, { useState, useEffect } from "react";
import contents from "../../assets/dataBase/TitlesData.json";
import Sidebar from "./components/Sidebar";
import ContentDisplay from "./components/ContentDisplay";
import Tabs, { TabType } from "./components/Tabs";
import { Section } from "./components/types/types";
import {Grid2} from "@mui/material";
import SidebarMenu from "./components/Sidebar";

const ContentPage: React.FC = () => {
  // const [sections, setSections] = useState<Section[]>([]);
  // const [activeSection, setActiveSection] = useState<Section | null>(null);
  // const [activeTab, setActiveTab] = useState<TabType>("теория");

  // useEffect(() => {
  //   const fetchSections = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8080/api/sections");
  //       const data = await response.json();
  //       setSections(data);
  //     } catch (error) {
  //       console.error("Error fetching sections:", error);
  //     }
  //   };
  //   fetchSections();
  // }, []);

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
  );
};

export default ContentPage;
