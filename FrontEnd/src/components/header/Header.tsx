import React, { useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Grid2, Typography, Box } from "@mui/material";
import { styled } from '@mui/system';
import { useSection } from "../../context/SectionContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';

const StyledHeader = styled("header")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2, 15),
  width: "100%",
  display: "flex", 
  marginBottom: theme.spacing(0.25),
  }));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.purple.light,
    fontWeight: "bold",
    fontSize: "20px",
    textDecoration: "none",
}));  

const CenteredTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: "bold",
  fontSize: "30px",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.purple.dark,
  fontSize: "17px",
  display: "flex",
  alignItems: "center",
  transform: "translateY(15%)",
  paddingLeft: "10%"
}))

const BoxForTitle = styled(Box)(({ theme }) => ({
  flex: "1 1 auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transform: "translateX(-10%)"
}))

const Header = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery("(min-width: 900px)");
  const location = useLocation();
  const { activeSection } = useSection();

  const pageTitles: Record<string, string> = {
    "/CourseContent": "Содержание курса",
    "/AboutPage": "О нас",
    "/FAQPage": "Частые вопросы",
  };
  
  let pageTitle = pageTitles[location.pathname] || "";

  if (activeSection && location.pathname.startsWith("/algorithmsPage")) {
    pageTitle = `${activeSection}`;
  }

  const isCentered = ["/CourseContent", "/AboutPage", "/FAQPage"].includes(location.pathname);

  return (
    <StyledHeader sx={{ boxShadow: 2 }}>
      <Grid2
        container
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: "0 0 auto", zIndex: "2" }}>
          <StyledLink to="/">
            <Typography
              variant="h1"
              style={{
                color: theme.palette.purple.light,
                fontSize: "40px",
              }}
            >
              AlgoHack
            </Typography>
          </StyledLink>
        </Box>


        {isLargeScreen && (
            isCentered ? (
              <BoxForTitle>
                <CenteredTitle>{pageTitle}</CenteredTitle>
              </BoxForTitle>
            ) : (
              <Box sx={{
                flex: "1 1 auto"}}>
              <SectionTitle>{pageTitle}</SectionTitle>
              </Box>
            )
          )}
  
      </Grid2>
    </StyledHeader>
  );
};

export default Header;