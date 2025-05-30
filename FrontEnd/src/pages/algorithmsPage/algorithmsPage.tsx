import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import contents from "../../assets/dataBase/CourseData.json";
import ContentDisplay from "./components/ContentDisplay";
import Tabs, { TabType } from "./components/Tabs";
import { Section } from "./components/types/types";
import SidebarMenu from "./components/Sidebar";
import { Grid2, useMediaQuery } from "@mui/material";
import { useSubSubSection } from "../../context/subSubSectionContext";
import menuData from "../../assets/dataBase/menuData.json";

const ContentPage = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [activeTab, setActiveTab] = useState<TabType>("теория");
  const [activeSection, setActiveSection] = useState<Section | null>(
    contents.length > 0 ? contents[0] : null
  );
  const [buttons, setButtons] = useState<TabType[]>(["теория"]);
  const [sectionData, setSectionData] = useState<any>(null);
  const { subSubSection: urlSubSubSection } = useParams();
  const { activeSubSubSection, setActiveSubSubSection } = useSubSubSection();
  useEffect(() => {
    if (urlSubSubSection) {
      const foundSubSubSection = menuData
        .flatMap(section => section.subSections)
        .flatMap(subSection => subSection.subSubSections)
        .find(subSub => subSub[1] === urlSubSubSection);
  
      if (foundSubSubSection) {
        setActiveSubSubSection(foundSubSubSection);
        setActiveTab("теория");
      }
    }
  }, [urlSubSubSection, setActiveSubSubSection]);

  useEffect(() => {
    if (!activeSubSubSection) {
      setSectionData(null);
      setButtons([]);
      return;
    }

    import(`../../assets/dataBase/Sections/${activeSubSubSection[1]}.json`)
      .then((data) => {
        setSectionData(data);

        const newButtons: TabType[] = ["теория"];
        if (data.code && data.code.trim() !== "") newButtons.push("код");
        if (data.visualization && data.visualization.trim() !== "") newButtons.push("визуализация");

        setButtons(newButtons);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setSectionData({
          title: activeSubSubSection[0],
          content: ["Нет данных"],
          code: "",
          visualization: "",
        });
        setButtons(["теория"]);
      });
  }, [activeSubSubSection]);

  return (
    <Grid2 container sx={{ height: "100%", overflow: "hidden" }}>
      <Grid2 size={{md: 3}} sx={{
        top: "1px", 
        overflowY: "auto",
        ...(!isMobile && { height: "calc(100vh - 65px)" }),
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
            display: 'none', 
          },
          }}>
          <ContentDisplay activeSection={activeSection} activeTab={activeTab} />
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={buttons}/>
      </Grid2>
    </Grid2>
  );
};

export default ContentPage;
