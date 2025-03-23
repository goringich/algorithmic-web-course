import React, { createContext, useState, useContext } from "react";
interface subSubSectionContextType {
  activeSubSubSection: string | null;
  setActiveSubSubSection: (Section: string | null) => void;
}

const subSubSectionContext = createContext<subSubSectionContextType | undefined>(undefined);

export const subSubSectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSubSubSection, setActiveSubSubSection] = useState<string | null>(null);

  return (
    <subSubSectionContext.Provider value={{ activeSubSubSection, setActiveSubSubSection }}>
      {children}
    </subSubSectionContext.Provider>
  );
};

export const useSubSubSection = () => {
  const context = useContext(subSubSectionContext);
  if (!context) {
    throw new Error("useSubSubSection must be used within a subSubSectionProvider");
  }
  return context;
};
