import React from "react";
import { Section } from "./types/types";
import ErrorBoundary from "../../../components/errorBoundary/ErrorBoundary";
import SegmentTreeVisualizer from "../../../visualizations/segmentTreeVisualizer/defaultSegmentTree/SegmentTreeVisualizer";
import FenwickTreeVisualizer from "../../../visualizations/fenwickTreeVisualizer/FenwickTreeVisualizer";
import { SegmentTreeProvider } from "../../../visualizations/segmentTreeVisualizer/common/context/SegmentTreeProvider";
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
            {/* <SegmentTreeProvider initialData={data}>
              <SegmentTreeVisualizer />
            </SegmentTreeProvider> */}
            <Container maxWidth="xl" sx={{ py: 2 }}>
            {/* < FenwickTreeVisualizer /> */}
            </Container>
          </ErrorBoundary>
          <div>{activeSection.visualization || "Визуализация не доступна"}</div>
        </>
      )}
    </div>
  );
};

export default ContentDisplay;
