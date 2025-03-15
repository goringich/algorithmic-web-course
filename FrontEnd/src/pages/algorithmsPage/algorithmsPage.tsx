import React, { useState } from "react";
import contents from "../../assets/dataBase/TitlesData.json";
import ContentDisplay from "./components/ContentDisplay";
import Tabs, { TabType } from "./components/Tabs";
import { Section } from "./components/types/types";
import SidebarMenu from "./components/Sidebar";
import { Grid2} from "@mui/material";


const ContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("теория");
  const [activeSection, setActiveSection] = useState<Section | null>(
    contents.length > 0 ? contents[0] : null
  );

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
