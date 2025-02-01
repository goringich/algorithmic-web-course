import React, { useState, useEffect } from "react";
import styles from "./algorithmsPage.module.scss";
import contents from "../../assets/dataBase/TitlesData.json";
import Sidebar from "./components/Sidebar";
import ContentDisplay from "./components/ContentDisplay";
import Tabs, { TabType } from "./components/Tabs";
import { Section } from "./components/types/types";

const ContentPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("теория");

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/sections");
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, []);

  return (
    <div className={styles.content_page}>
      <Sidebar
        contents={contents}
        onSectionSelect={(section) => setActiveSection(section)}
      />
      <main className={styles.main}>
        <ContentDisplay activeSection={activeSection} activeTab={activeTab} />
        <Tabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
      </main>
    </div>
  );
};

export default ContentPage;
