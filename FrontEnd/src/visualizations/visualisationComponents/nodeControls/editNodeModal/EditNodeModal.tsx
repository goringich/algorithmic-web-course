import React, { useEffect, useCallback } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  onClose: () => void; // Новый метод для закрытия окна
}

export function EditNodeModal({
  selectedNode,
  delta,
  setDelta,
  onUpdate,
  onRemove,
  onClose,
}: EditNodeModalProps) {
  const { position, handleMouseDown, handleMouseMove, handleMouseUp } = useDrag(100, 100);

  // Закрытие окна при нажатии Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Закрытие окна при изменении `selectedNode`
  useEffect(() => {
    if (!selectedNode) {
      onClose();
    }
  }, [selectedNode, onClose]);

  if (!selectedNode) {
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
      zIndex={2000}
      width="300px"
      boxShadow="0 8px 16px rgba(0,0,0,0.1)"
      style={{ userSelect: "none" }}
      onMouseMove={(e) => handleMouseMove(e, window.innerWidth, window.innerHeight, 300, 150)}
      onMouseUp={handleMouseUp}
    >
      {/* Заголовок с кнопкой закрытия */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onMouseDown={handleMouseDown}
        sx={{
          cursor: "move",
          backgroundColor: "#eee",
          padding: "5px 10px",
          fontWeight: "bold",
          borderRadius: "5px 5px 0 0",
        }}
      >
        <Typography variant="body1">Редактирование узла</Typography>
        <IconButton size="small" onClick={onClose} sx={{ padding: "5px" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Информация о узле */}
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

      {/* Поле для изменения значения */}
      <TextField
        type="number"
        value={delta}
        onChange={(e) => setDelta(parseInt(e.target.value, 10) || 0)}
        fullWidth
        sx={{ marginTop: 1 }}
      />

      {/* Кнопки Обновить / Удалить */}
      <Button
        onClick={() => {
          onUpdate();
          onClose(); // Закрываем после обновления
        }}
        variant="contained"
        color="success"
        fullWidth
        sx={{ borderRadius: "20px", marginTop: 1 }}
      >
        Обновить
      </Button>

      <Button
        onClick={() => {
          onRemove();
          onClose(); // Закрываем после удаления
        }}
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
