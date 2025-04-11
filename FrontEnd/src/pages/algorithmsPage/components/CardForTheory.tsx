import React, { useState } from "react";
import { Grid2, Card, Typography } from "@mui/material";
import { styled } from '@mui/system';
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface TheoryProps {
  text: string | { type: "table"; headers: string[]; rows: string[][] };
  onTableLinkClick?: () => void;
  visible?: boolean;
}


const Cards = styled(Card)<{ theme: Theme }>(({ theme }) => ({
  width: "90%",
  backgroundColor: theme.palette.background.textCard,
  borderRadius: theme.shape.cardRadius,
  boxShadow: theme.shadows[3],
  margin: "auto",
  marginBottom: theme.spacing(4),
  padding: theme.spacing(5),
}));

const TypographyForDescription = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  color: theme.palette.text.primary,
  whiteSpace: "pre-wrap",
}));

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
    <thead>
      <tr>
        {headers.map((h, i) => (
          <th key={i} style={{ border: "1px solid gray", padding: "4px" }}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, rIdx) => (
        <tr key={rIdx}>
          {row.map((cell, cIdx) => (
            <td key={cIdx} style={{ border: "1px solid lightgray", padding: "4px" }}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const CardForTheory: React.FC<TheoryProps> = ({ text, onTableLinkClick, visible }) => {
  const [openTable, setOpenTable] = useState(false);
  const theme = useTheme();

  if (typeof text === "object" && text.type === "table") {
    if (!visible) return null;
    return (
        <Table headers={text.headers} rows={text.rows} />
    );
  }

  const isMath = typeof text === "string" && text.includes('$') && text.match(/\$(.*?)\$/);

  const highlightText = (rawText: string) => {
    return rawText.split(/(\*\*(.*?)\*\*|__(.*?)__)/).map((part, index) => {
      if (!part || part.startsWith("**") || part.startsWith("__")) return null;

      if (rawText.includes(`**${part}**`)) {
        return (
          <span key={index} style={{ color: theme.palette.error.main, fontWeight: "bold" }}>
            {part}
          </span>
        );
      }

      if (rawText.includes(`__${part}__`)) {
        return (
          <span key={index} style={{ color: theme.palette.purple.dark, fontWeight: "bold" }}>
            {part}
          </span>
        );
      }

      if (part.includes("[[TABLE_LINK]]")) {
        const pieces = part.split("[[TABLE_LINK]]");
        return pieces.map((p, i) => (
          <React.Fragment key={i}>
            {p}
            {i < pieces.length - 1 && (
              <span
                onClick={onTableLinkClick}
                style={{ color: theme.palette.primary.main, cursor: "pointer", fontWeight: "bold" }}
              >
                таблице
              </span>
            )}
          </React.Fragment>
        ));
      }      
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Cards>
      <Grid2>
        <TypographyForDescription>
          {isMath
            ? text.split(/\$(.*?)\$/).map((part, i) =>
                i % 2 === 1 ? (
                  <InlineMath key={i} math={part} />
                ) : (
                  <span key={i}>{highlightText(part)}</span>
                )
              )
            : highlightText(text as string)}
        </TypographyForDescription>
      </Grid2>
    </Cards>
  );
};

export default CardForTheory;
