import React, { useState } from "react";
import Box from "@mui/material/Box";
import contents from "../../assets/dataBase/TitlesData.json";
import styles from "./algorithmsPage.module.scss";
import ContentDisplay from "./components/ContentDisplay";
import Tabs, { TabType } from "./components/Tabs";
import { Section } from "./components/types/types";
import SidebarMenu from "./components/Sidebar";

const ContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("теория");
  const [activeSection, setActiveSection] = useState<Section | null>(
    contents.length > 0 ? contents[0] : null
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Боковое меню слева */}
      <SidebarMenu />

      {/* Основное содержимое справа */}
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <ContentDisplay activeSection={activeSection} activeTab={activeTab} />
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      </Box>
    </Box>
  );
};

export default ContentPage;
