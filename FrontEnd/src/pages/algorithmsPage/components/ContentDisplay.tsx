import React from "react";
import styles from "../algorithmsPage.module.scss";
import { Provider } from 'react-redux';
import store from '../../../visualizations/store/store';
import { Section } from "./types/types";
import ErrorBoundary from "../../../components/errorBoundary/ErrorBoundary";
import SegmentTreeVisualizer from "../../../visualizations/segmentTreeVisualizer/SegmentTreeVisualizer";
import { TabType } from "./Tabs";

interface ContentDisplayProps {
  activeSection: Section | null;
  activeTab: TabType;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ activeSection, activeTab }) => {
  if (!activeSection) {
    return <h2>Выберите раздел для просмотра</h2>;
  }
  return (
    <div>
      <h1>{activeSection.title}</h1>
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
      {activeTab === "комплексный анализ" && (
        <div>{activeSection.visualization || "Мы всё итак знаем, зачем анализировать"}</div>
      )}
    </div>
  );
};

export default ContentDisplay;
