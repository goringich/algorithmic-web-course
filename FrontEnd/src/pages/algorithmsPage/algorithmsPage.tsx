import React, { useState, useEffect } from "react";
import styles from "./algorithmsPage.module.scss";
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
        const response = await fetch("http://localhost:8081/api/sections");
        const data = await response.json();
        console.log("Темы из API:", data);

        if (Array.isArray(data)) {
          setSections(data); // Убеждаемся, что сохраняем массив
        } else {
          console.error("API вернул не массив:", data);
          setSections([]); // Если данные некорректные, подставляем пустой массив
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setSections([]); // Если ошибка — ставим пустой массив, чтобы избежать `undefined`
      }
    };

    fetchSections();
  }, []);

  return (
    <div className={styles.content_page}>
      <Sidebar contents={sections} onSectionSelect={(section) => setActiveSection(section)} />
      <main className={styles.main}>
        <ContentDisplay activeSection={activeSection} activeTab={activeTab} />
        <Tabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
      </main>
    </div>
  );
};

export default ContentPage;
