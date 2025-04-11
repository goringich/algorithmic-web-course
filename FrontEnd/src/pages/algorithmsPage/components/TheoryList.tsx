import React, { useState } from "react";
import CardForTheory from "./CardForTheory";

interface TheoryItem {
  text: string | { type: "table"; headers: string[]; rows: string[][] };
}

const TheoryList: React.FC<{ content: TheoryItem[] }> = ({ content }) => {
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const toggleTable = (index: number) => {
    setOpenedIndex((prev) => (prev === index ? null : index));
  };
  return (
    <>
      {content.map((item, index) => {
        const isTable = typeof item.text === "object" && item.text.type === "table";

        return (
          <CardForTheory
            key={index}
            text={item.text}
            visible={!isTable || index === openedIndex}
            onTableLinkClick={() => toggleTable(index + 1)}
          />
        );
      })}
    </>
  );
};

export default TheoryList;
