import React from "react";
import { TextField, Button, Box } from "@mui/material";
import PropTypes from "prop-types";

const AddElementForm = ({ newValue, setNewValue, handleAddElement }) => (
  <Box display="flex" justifyContent="center" gap={2} marginBottom={2}>
    <TextField
      label="Новый лист"
      value={newValue}
      onChange={(e) => setNewValue(e.target.value)}
      type="number"
      variant="outlined"
      sx={{ width: "150px" }}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={handleAddElement}
      sx={{ borderRadius: "20px" }}
    >
      Добавить
    </Button>
  </Box>
);

AddElementForm.propTypes = {
  newValue: PropTypes.string.isRequired,
  setNewValue: PropTypes.func.isRequired,
  handleAddElement: PropTypes.func.isRequired,
};

export default AddElementForm;