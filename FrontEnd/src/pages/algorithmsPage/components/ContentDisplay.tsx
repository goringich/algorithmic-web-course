import React,  { useEffect, useState } from "react";
import FenwickTreeVisualizer from "../../../visualizations/fenwickTreeVisualizer/FenwickTreeVisualizer";
import { SegmentTreeProvider } from "../../../visualizations/segmentTreeVisualizer/common/context/SegmentTreeProvider";
import { Provider } from 'react-redux';
import store from '../../../visualizations/store/store';
import { Section } from "./types/types";
import ErrorBoundary from "../../../components/errorBoundary/ErrorBoundary";
import SegmentTreeVisualizer from "../../../visualizations/segmentTreeVisualizer/SegmentTreeVisualizer";
import { TabType } from "./Tabs";
import { useSubSubSection } from "../../../context/subSubSectionContext";
import CardForTheory from "./CardForTheory";


interface ContentDisplayProps {
  activeSection: Section | null;
  activeTab: TabType;
}

interface subSubSectionContent {
  title: string;
  content: string;
  code: string;
  visualization: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ activeSection, activeTab }) => {
  const { activeSubSubSection } = useSubSubSection();
  const [sectionData, setSectionData] = useState<subSubSectionContent | null>(null);

  useEffect(() => {
    if (!activeSubSubSection) {
      setSectionData(null);
      return;
    }

    import(`../../../assets/dataBase/Sections/${activeSubSubSection}.json`)
      .then((data) => setSectionData(data))
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setSectionData({
          title: activeSubSubSection,
          content: "Нет данных",
          code: "Код отсутствует",
          visualization: "Визуализация недоступна",
        });
      });
  }, [activeSubSubSection]);

  return (
    <div>
      {activeTab === "теория" && <p>{<CardForTheory text = {sectionData?.content}/> || "Нет данных"}</p>}
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
