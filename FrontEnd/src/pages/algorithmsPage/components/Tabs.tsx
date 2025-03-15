import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type TabType = "теория" | "код" | "визуализация" ;

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const theme = useTheme();
  const tabs: TabType[] = ["теория", "код", "визуализация"];
  return (
    <div style={{display: "flex", justifyContent: "center", marginBottom: theme.spacing(4)}}>
      {tabs.map((tab) => (
        <Button
          key={tab}
          onClick={() => onTabChange(tab)}
          sx={{color: theme.palette.purple.dark,
            "&:hover" : {backgroundColor: `rgba(${theme.palette.purple.onHover}, 0.85)`},
            backgroundColor: activeTab === tab ? theme.palette.purple.toClick : "inherit",
            boxShadow: activeTab === tab ? "2" : "inherit"}}>
          {tab}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;