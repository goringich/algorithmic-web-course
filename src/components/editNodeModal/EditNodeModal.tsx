// src/components/EditNodeModal.js
import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import PropTypes from "prop-types";

const EditNodeModal = ({
  selectedNode,
  delta,
  setDelta,
  handleUpdate,
  handleRemoveLeaf,
  editBoxPos,
  handleEditBoxMouseDown,
  isDragging,
}) => (
  <Box
    position="absolute"
    left={editBoxPos.x}
    top={editBoxPos.y}
    bgcolor="#fff"
    padding="20px"
    border="1px solid #ddd"
    borderRadius="10px"
    zIndex={100}
    width="300px"
    boxShadow="0 8px 16px rgba(0,0,0,0.1)"
    style={{ userSelect: "none", cursor: isDragging ? "grabbing" : "grab" }}
  >
    {/* Drag Handle */}
    <Box
      onMouseDown={handleEditBoxMouseDown}
      sx={{
        cursor: "move",
        backgroundColor: "#eee",
        padding: "5px 0",
        textAlign: "center",
        fontWeight: "bold",
        borderRadius: "5px",
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
      onClick={handleUpdate}
      variant="contained"
      color="success"
      fullWidth
      sx={{ borderRadius: "20px", marginTop: 1 }}
    >
      Обновить
    </Button>
    <Button
      onClick={handleRemoveLeaf}
      variant="contained"
      color="error"
      fullWidth
      sx={{ borderRadius: "20px", marginTop: 1 }}
    >
      Удалить
    </Button>
  </Box>
);

EditNodeModal.propTypes = {
  selectedNode: PropTypes.object.isRequired,
  delta: PropTypes.number.isRequired,
  setDelta: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleRemoveLeaf: PropTypes.func.isRequired,
  editBoxPos: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  handleEditBoxMouseDown: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default EditNodeModal;
