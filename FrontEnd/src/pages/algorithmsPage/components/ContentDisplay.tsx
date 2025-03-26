import React,  { useEffect, useState } from "react";
import FenwickTreeVisualizer from "../../../visualizations/fenwickTreeVisualizer/FenwickTreeVisualizer";
import { SegmentTreeProvider } from "../../../visualizations/segmentTreeVisualizer/common/context/SegmentTreeProvider";
import { Provider } from 'react-redux';
import {Typography} from "@mui/material";
import store from '../../../visualizations/store/store';
import { Section } from "./types/types";
import ErrorBoundary from "../../../components/errorBoundary/ErrorBoundary";
import SegmentTreeVisualizer from "../../../visualizations/segmentTreeVisualizer/SegmentTreeVisualizer";
import { TabType } from "./Tabs";
import { useSubSubSection } from "../../../context/subSubSectionContext";
import CardForTheory from "./CardForTheory";
import { styled } from '@mui/system';
import { useTheme } from "@mui/material/styles";

interface ContentDisplayProps {
  activeSection: Section | null;
  activeTab: TabType;
}

interface subSubSectionContent {
  title: string;
  content: string[];
  code: string;
  visualization: string;
}

const TypographyForTitle = styled(Typography)(({theme}) => ({
  fontSize: "1.4rem",
  textAlign: "center", 
  padding: theme.spacing(4),

}));

const ContentDisplay: React.FC<ContentDisplayProps> = ({ activeSection, activeTab }) => {
  const { activeSubSubSection } = useSubSubSection();
  const [sectionData, setSectionData] = useState<subSubSectionContent | null>(null);

  useEffect(() => {
    if (!activeSubSubSection) {
      setSectionData(null);
      return;
    }

    import(`../../../assets/dataBase/Sections/${activeSubSubSection[1]}.json`)
      .then((data) => setSectionData(data))
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setSectionData({
          title: activeSubSubSection[0],
          content: ["Нет данных"],
          code: "Код отсутствует",
          visualization: "Визуализация недоступна",
        });
      });
  }, [activeSubSubSection]);

  return (
    <div>
      <TypographyForTitle> {sectionData?.title} </TypographyForTitle>
      {activeTab === "теория" && (
        sectionData?.content ? (
          sectionData.content.map((info, index) => (
            <CardForTheory key={index} text={info} />
          ))
        ) : (
          <p>Нет данных</p>
        )
      )}

      {activeTab === "код" && (
      <pre>
        <code>{sectionData?.code || "Код отсутствует"}</code>
      </pre>
    )}
      {activeTab === "визуализация" && (
          <ErrorBoundary>
            <Provider store={store}>
              <SegmentTreeVisualizer />
            </Provider>
          </ErrorBoundary>
      )}
    </div>
  );
};

export default ContentDisplay;
