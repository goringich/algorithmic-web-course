import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

interface NodeData {
  id: string;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: string[];
}

interface EditNodeModalProps {
  selectedNode: NodeData | null;
  delta: number;
  setDelta: (val: number) => void;
  onUpdate: () => void;
  onRemove: () => void;
  position: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function EditNodeModal({
  selectedNode,
  delta,
  setDelta,
  onUpdate,
  onRemove,
  position,
  onMouseDown
}: EditNodeModalProps) {
  if (!selectedNode) return null;

  return (
    <Box
      position="absolute"
      left={position.x}
      top={position.y}
      bgcolor="#fff"
      padding="20px"
      border="1px solid #ddd"
      borderRadius="10px"
      zIndex={100}
      width="300px"
      boxShadow="0 8px 16px rgba(0,0,0,0.1)"
      style={{ userSelect: "none" }}
    >
      <Box
        onMouseDown={onMouseDown}
        sx={{
          cursor: "move",
          backgroundColor: "#eee",
          padding: "5px 0",
          textAlign: "center",
          fontWeight: "bold",
          borderRadius: "5px"
        }}
      >
        Перетащи меня
      </Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 1 }}>
        Лист: {selectedNode.label}
      </Typography>
      <TextField
        type="number"
        value={delta}
        onChange={(e) => setDelta(parseInt(e.target.value, 10) || 0)}
        fullWidth
        sx={{ marginTop: 1 }}
      />
      <Button
        onClick={onUpdate}
        variant="contained"
        color="success"
        fullWidth
        sx={{ borderRadius: "20px", marginTop: 1 }}
      >
        Обновить
      </Button>
      <Button
        onClick={onRemove}
        variant="contained"
        color="error"
        fullWidth
        sx={{ borderRadius: "20px", marginTop: 1 }}
      >
        Удалить
      </Button>
    </Box>
  );
}
