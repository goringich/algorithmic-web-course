// src/components/NotificationSnackbar.js
import React from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationSnackbar = ({ open, message, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default NotificationSnackbar;
