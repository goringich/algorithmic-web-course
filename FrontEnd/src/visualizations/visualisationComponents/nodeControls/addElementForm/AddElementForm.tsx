import React from "react";
import { Box, TextField, Button } from "@mui/material";

interface AddElementFormProps {
  newValue: number;
  onChangeValue: (val: number) => void;
  onAdd: () => void;
  disabled?: boolean;
}

export function AddElementForm({ newValue, onChangeValue, onAdd, disabled }: AddElementFormProps) {
  return (
    <Box display="flex" justifyContent="center" gap={2} marginBottom={2}>
      <TextField
        label="Новый лист"
        value={newValue}
        onChange={(e) => onChangeValue(Number(e.target.value) || 0)} 
        type="number"
        variant="outlined"
        sx={{ width: "150px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onAdd}
        sx={{ borderRadius: "20px" }}
        disabled={disabled}
      >
        Добавить
      </Button>
    </Box>
  );
}
