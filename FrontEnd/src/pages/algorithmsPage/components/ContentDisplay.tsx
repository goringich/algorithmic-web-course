import React from "react";
import { Section } from "./types/types";
import ErrorBoundary from "../../../components/errorBoundary/ErrorBoundary";
import SegmentTreeVisualizer from "../../../visualizations/segmentTreeVisualizer/SegmentTreeVisualizer";
import { TabType } from "./Tabs";

interface ContentDisplayProps {
  activeSection: Section | null;
  activeTab: TabType;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ activeSection, activeTab }) => {
  const data = [5, 8, 6, 3, 2, 7, 2, 6];
  return (
    <div>
      {activeTab === "теория" && (
        <p>{activeSection.content || "Мы не сделали эту часть ещё :("}</p>
      )}
      {activeTab === "код" && (
        <pre>
          <code>{activeSection.code || "Код не добавлен для этой секции"}</code>
        </pre>
      )}
      {activeTab === "визуализация" && (
        <>
          <ErrorBoundary>
            <Provider store={store}>
              <SegmentTreeVisualizer />
            </Provider>
          </ErrorBoundary>
          <div>{activeSection.visualization || "Визуализация не доступна"}</div>
        </>
      )}
    </div>
  );
};

export default ContentDisplay;
