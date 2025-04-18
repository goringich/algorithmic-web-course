import React, { useEffect, useState } from "react";
import FenwickTreeVisualizer from "../../../visualizations/fenwickTreeVisualizer/FenwickTreeVisualizer";
import SegmentTreeVisualizer from "../../../visualizations/segmentTreeVisualizer/SegmentTreeVisualizer";
import { Provider } from "react-redux";
import store from "../../../visualizations/store/store";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useSubSubSection } from "../../../context/subSubSectionContext";
import CodeBlock from "./CodeBlock";
import TheoryList from "./TheoryList";
import ErrorBoundary from "../../../components/errorBoundary/ErrorBoundary";
import { Section } from "./types/types";
import { TabType } from "./Tabs";

interface ContentDisplayProps {
  activeSection: Section | null;
  activeTab: TabType;
}

interface SubSubSectionContent {
  title: string;
  content: Array<string | { type: "table"; headers: string[]; rows: string[][] }>;
  code: string;
  visualization: string;
}

const TypographyForTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.4rem",
  textAlign: "center",
  padding: theme.spacing(4),
}));

const ContentDisplay: React.FC<ContentDisplayProps> = ({ activeSection, activeTab }) => {
  const { activeSubSubSection } = useSubSubSection();
  const [sectionData, setSectionData] = useState<SubSubSectionContent | null>(null);

  useEffect(() => {
    console.log("useEffect: activeSubSubSection =", activeSubSubSection);
    if (!activeSubSubSection) {
      console.log("Нет активного подподраздела");
      setSectionData(null);
      return;
    }

    import(`../../../assets/dataBase/Sections/${activeSubSubSection[1]}.json`)
      .then((mod) => {
        console.log("JSON module loaded:", mod);
        setSectionData(mod.default || mod);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setSectionData({
          title: activeSubSubSection[0],
          content: ["Нет данных"],
          code: "Код отсутствует",
          visualization: "",
        });
      });
  }, [activeSubSubSection]);

  const renderVisualization = () => {
    console.log("renderVisualization:", { activeSubSubSection });
    if (!activeSubSubSection) {
      console.log("Нет activeSubSubSection");
      return <p>Визуализация недоступна</p>;
    }

    const key = activeSubSubSection[1].toLowerCase();
    console.log("Visualization key:", key);

    if (key.includes("fenwick")) {
      return <FenwickTreeVisualizer />;
    }
    if (key.includes("segment")) {
      return <SegmentTreeVisualizer />;
    }

    console.log("Не найдена подходящая визуализация");
    return <p>Визуализация недоступна</p>;
  };

  console.log("Rendering ContentDisplay, activeTab =", activeTab);
  return (
    <div>
      <TypographyForTitle>{sectionData?.title}</TypographyForTitle>

      {activeTab === "теория" && (
        sectionData?.content ? (
          <TheoryList
            content={sectionData.content.map(item =>
              typeof item === "string" || (typeof item === "object" && item.type === "table")
                ? { text: item }
                : item
            )}
          />
        ) : (
          <p>Нет данных</p>
        )
      )}

      {activeTab === "код" && (
        sectionData?.code ? (
          <CodeBlock code={sectionData.code} language="cpp" />
        ) : (
          <p>Код отсутствует</p>
        )
      )}

      {activeTab === "визуализация" && (
        <ErrorBoundary>
          <Provider store={store}>
            {renderVisualization()}
          </Provider>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default ContentDisplay;
