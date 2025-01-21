import React from "react";
import { Typography } from "@mui/material";

const Header: React.FC = () => (
  <Typography variant="h4" marginBottom={2} sx={{ fontWeight: "bold" }}>
    Segment Tree Visualizer (WASM)
  </Typography>
);

export default Header;
