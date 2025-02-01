import React, { useEffect, useState } from "react";
import styles from "./algorithmsPage.module.scss";
import SubSectionList from "./components/SubSectionList";
import { Section } from "./components/types/types";

interface SidebarProps {
  onSectionSelect: (section: Section) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSectionSelect }) => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/sections");
        const data = await response.json();
        console.log("Темы из API:", data);
        setSections(data);
      } catch (error) {
        console.error("Ошибка при загрузке тем:", error);
      }
    };
    fetchSections();
  }, []);

  return (
    <nav className={styles.sidebar}>
      <h3>Содержание</h3>
      {sections.map((section, index) => (
        <div key={index}>
          <button
            onClick={() => onSectionSelect(section)}
            className={styles.section}
          >
            {section.title}
          </button>
          <SubSectionList subSections={section.subSections} onSectionSelect={onSectionSelect} />
        </div>
      ))}
      <button className={styles.back_button}>Вернуться к содержанию</button>
    </nav>
  );
};

export default Sidebar;
