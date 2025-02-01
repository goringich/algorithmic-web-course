import React from "react";
import { Section } from "./types/types";

interface SubSectionListProps {
  subSections?: Section[];
  onSectionSelect: (section: Section) => void;
}

const SubSectionList: React.FC<SubSectionListProps> = ({ subSections, onSectionSelect }) => {
  if (!subSections) return null;
  return (
    <ul>
      {subSections.map((section, index) => (
        <li key={index}>
          <button onClick={() => onSectionSelect(section)}>
            {section.title}
          </button>
          <SubSectionList subSections={section.subSection} onSectionSelect={onSectionSelect} />
        </li>
      ))}
    </ul>
  );
};

export default SubSectionList;
