import React, { createContext, useState, useContext } from "react";
interface subSubSectionContextType {
  activeSubSubSection: string[] | null;
  setActiveSubSubSection: (Section: string[] | null) => void;
}

const SubSubSectionContext = createContext<subSubSectionContextType | undefined>(undefined);

export const SubSubSectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSubSubSection, setActiveSubSubSection] = useState<string[] | null>(null);

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
