import React from "react";
import { Section } from "./types/types";

interface SubSectionListProps {
  subSections?: string | Section[];
  onSectionSelect: (section: Section) => void;
}

const SubSectionList: React.FC<SubSectionListProps> = ({ subSections, onSectionSelect }) => {
  if (!subSections) return null;

  let parsedSubSections: Section[] = [];
  if (typeof subSections === "string") {
    try {
      parsedSubSections = JSON.parse(subSections);
    } catch (error) {
      console.error("Ошибка парсинга subSections:", error);
      return null;
    }
  } else {
    parsedSubSections = subSections;
  }

  if (!Array.isArray(parsedSubSections)) {
    console.error("subSections не массив:", parsedSubSections);
    return null;
  }

  return (
    <ul>
      {parsedSubSections.map((sub, index) => (
        <li key={index}>
          <button onClick={() => onSectionSelect(sub)}>
            {sub.title}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SubSectionList;
