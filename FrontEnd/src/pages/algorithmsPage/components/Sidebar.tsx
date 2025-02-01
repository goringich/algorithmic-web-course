import React from "react";
import styles from "../algorithmsPage.module.scss";
import SubSectionList from "./SubSectionList";
import { Section } from "./types/types";

interface SidebarProps {
  contents: Section[];
  onSectionSelect: (section: Section) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ contents = [], onSectionSelect }) => {
  console.log("Sidebar contents:", contents); // Проверяем, какие данные приходят

  return (
    <nav className={styles.sidebar}>
      <h3>Содержание</h3>
      {Array.isArray(contents) && contents.length > 0 ? (
        contents.map((section, index) => (
          <div key={index}>
            <button onClick={() => onSectionSelect(section)} className={styles.section}>
              {section.title}
            </button>
            <SubSectionList subSections={section.subSections || []} onSectionSelect={onSectionSelect} />
          </div>
        ))
      ) : (
        <p>Загрузка данных...</p> // Пока загружается API, отображаем текст
      )}
      <button className={styles.back_button}>Вернуться к содержанию</button>
    </nav>
  );
};

export default Sidebar;
