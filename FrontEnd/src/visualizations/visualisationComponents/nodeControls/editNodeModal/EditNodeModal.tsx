import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useDrag } from "./utils/UseDrag"; 

interface NodeData {
  id: number;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: number[];
}

interface EditNodeModalProps {
  selectedNode: NodeData | null;
  delta: number;
  setDelta: (val: number) => void;
  onUpdate: () => void;
  onRemove: () => void;
}

export function EditNodeModal({
  selectedNode,
  delta,
  setDelta,
  onUpdate,
  onRemove,
}: EditNodeModalProps) {
  const { position, handleMouseDown, handleMouseMove, handleMouseUp } = useDrag(100, 100);

  if (!selectedNode || selectedNode.x === undefined || selectedNode.y === undefined) {
    return null;
  }

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
      onMouseMove={(e) => handleMouseMove(e, window.innerWidth, window.innerHeight, 300, 150)}
      onMouseUp={handleMouseUp}
    >
      <Box
        onMouseDown={handleMouseDown}
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
        Узел: {selectedNode.label}
      </Typography>
      <Typography variant="body2" sx={{ marginTop: 1 }}>
        <strong>ID:</strong> {selectedNode.id}
      </Typography>
      <Typography variant="body2">
        <strong>Координаты:</strong> ({selectedNode.x}, {selectedNode.y})
      </Typography>
      <Typography variant="body2">
        <strong>Диапазон:</strong> [{selectedNode.range[0]}, {selectedNode.range[1]}]
      </Typography>
      <Typography variant="body2">
        <strong>Значение:</strong> {selectedNode.value}
      </Typography>
      <Typography variant="body2">
        <strong>Дети:</strong>{" "}
        {selectedNode.children.length > 0 ? selectedNode.children.join(", ") : "Нет"}
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
