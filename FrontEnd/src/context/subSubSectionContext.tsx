import React, { createContext, useState, useContext } from "react";
import menuData from "../assets/dataBase/menuData";
import { useParams } from "react-router-dom";

interface subSubSectionContextType {
  activeSubSubSection: string[] | null;
  setActiveSubSubSection: (Section: string[] | null) => void;
}

const SubSubSectionContext = createContext<subSubSectionContextType | undefined>(undefined);

export const SubSubSectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { subSubSection: urlSubSubSection } = useParams();
  const initialSubSubSection = menuData
    .flatMap(section => section.subSections)
    .flatMap(subSection => subSection.subSubSections)
    .find(subSub => subSub[1] === urlSubSubSection) || null;
  
  const [activeSubSubSection, setActiveSubSubSection] = useState<string[] | null>(initialSubSubSection);
  
  return (
    <SubSubSectionContext.Provider value={{ activeSubSubSection, setActiveSubSubSection }}>
      {children}
    </SubSubSectionContext.Provider>
  );
};

export const useSubSubSection = () => {
  const context = useContext(SubSubSectionContext);
  if (!context) {
    throw new Error("useSubSubSection must be used within a subSubSectionProvider");
  }
  return context;
};
