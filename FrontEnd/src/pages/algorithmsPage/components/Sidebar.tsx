import React from "react";
import styles from "../algorithmsPage.module.scss";
import SubSectionList from "./SubSectionList";
import { Section } from "./types/types";

interface SidebarProps {
  contents: Section[];
  onSectionSelect: (section: Section) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ contents, onSectionSelect }) => {
  return (
    <nav className={styles.sidebar}>
      <h3>Содержание</h3>
      {contents.map((section, index) => (
        <div key={index}>
          <button
            onClick={() => onSectionSelect(section)}
            className={styles.section}
          >
            {section.title}
          </button>
          <SubSectionList subSections={section.subSection} onSectionSelect={onSectionSelect} />
        </div>
      ))}
      <button className={styles.back_button}>
        Вернуться к содержанию
      </button>
    </nav>
  );
};

export default Sidebar;
