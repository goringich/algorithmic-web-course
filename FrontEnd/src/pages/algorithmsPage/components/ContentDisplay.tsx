import React from "react";
<<<<<<< HEAD
import { Section } from "./types/types";
import ErrorBoundary from "../../../components/errorBoundary/ErrorBoundary";
import SegmentTreeVisualizer from "../../../visualizations/segmentTreeVisualizer/defaultSegmentTree/SegmentTreeVisualizer";
import FenwickTreeVisualizer from "../../../visualizations/fenwickTreeVisualizer/FenwickTreeVisualizer";
import { SegmentTreeProvider } from "../../../visualizations/segmentTreeVisualizer/common/context/SegmentTreeProvider";
=======
import styles from "../algorithmsPage.module.scss";
import { Provider } from 'react-redux';
import store from '../../../visualizations/store/store';
import { Section } from "./types/types";
import ErrorBoundary from "../../../components/errorBoundary/ErrorBoundary";
import SegmentTreeVisualizer from "../../../visualizations/segmentTreeVisualizer/SegmentTreeVisualizer";
>>>>>>> 12c56a5 (the code is brought to a logical point, all functions work, but without animations, bugs are present)
import { TabType } from "./Tabs";
import { Container } from '@mui/material';

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
<<<<<<< HEAD
            {/* <SegmentTreeProvider initialData={data}>
              <SegmentTreeVisualizer />
            </SegmentTreeProvider> */}
            <Container maxWidth="xl" sx={{ py: 2 }}>
            {/* < FenwickTreeVisualizer /> */}
            </Container>
=======
            <Provider store={store}>
              <SegmentTreeVisualizer />
            </Provider>
>>>>>>> 12c56a5 (the code is brought to a logical point, all functions work, but without animations, bugs are present)
          </ErrorBoundary>
          <div>{activeSection.visualization || "Визуализация не доступна"}</div>
        </>
      )}
    </div>
  );
};

export default ContentDisplay;
