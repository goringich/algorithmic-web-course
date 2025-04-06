import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Paper, Fab, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";
import { Theme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook"; // Добавляем иконку
import menuData from "../../assets/dataBase/menuData"; 

const FabButton = styled(Fab)(({ theme }) => ({
  width: "50px",
  height: "50px",
  background: theme.palette.background.card,
  fontSize: "16px",
  color: theme.palette.text.primary,
  marginRight: theme.spacing(4),
}));

const CustomSubtitle = styled("h2")<{ theme: Theme }>(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 500,
  color: theme.palette.text.primary,
  overflowWrap: "break-word",
  wordBreak: "break-word",
}));

const AccordionContainer = styled(Paper)<{ theme: Theme }>(({ theme }) => ({
  width: "100%",
  background: theme.palette.background.cardContent,
  borderRadius: theme.shape.cardRadius,
  padding: "20px",
  margin: "20px auto",
  flexDirection: "column",
}));

const AccordionStyled = styled(Accordion)<{ theme: Theme }>(({ theme }) => ({
  background: theme.palette.background.cardContent,
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
}));

const CourseBox = styled("ul")<{ theme: Theme }>(({ theme }) => ({
  width: "100%",
  padding: "15px",
  background: theme.palette.background.card,
  borderRadius: theme.shape.cardRadius,
  listStyle: "none",
}));

const ListItem = styled("li")(({ theme }) => ({
  fontSize: "18px",
  marginBottom: "8px",
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "color 0.3s",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  transition: "color 0.3s",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const ContentPage: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [openSubSection, setOpenSubSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const toggleSubSection = (index: number) => {
    setOpenSubSection(openSubSection === index ? null : index);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <AccordionContainer elevation={3}>
          {menuData.map((section, index) => (
            <AccordionStyled key={index} expanded={openSection === index} onChange={() => toggleSection(index)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center" spacing={2} sx={{ flexWrap: "nowrap", minWidth: 0, gap: 1 }}>
                  <Grid item sx={{ flexShrink: 0 }}>
                    <FabButton size="small">{index + 1}</FabButton>
                  </Grid>
                  <Grid item sx={{ flexGrow: 1, minWidth: 0 }}>
                    <CustomSubtitle style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>
                      {section.title}
                    </CustomSubtitle>
                  </Grid>
                </Grid>
              </AccordionSummary>
              {section.subSections.length > 0 && (
                <AccordionDetails sx={{ paddingLeft: 4, paddingRight: 4 }}>
                  {section.subSections.map((subSection, subIndex) => (
                    <AccordionStyled
                      key={subIndex}
                      expanded={openSubSection === subIndex}
                      onChange={() => toggleSubSection(subIndex)}
                    >
                      <AccordionSummary >
                        <CustomSubtitle style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
                          {subSection.title}
                        </CustomSubtitle>
                      </AccordionSummary>

                      <AccordionDetails>
                        <CourseBox>
                          {subSection.subSubSections.map(([name, path], idx) => (
                            <React.Fragment key={idx}>
                              <ListItem>
                                <StyledLink to={`/algorithmsPage/${path}`}>{name}</StyledLink>
                              </ListItem>
                              {idx < subSection.subSubSections.length - 1 && <Divider />} {/* Разделитель между пунктами */}
                            </React.Fragment>
                          ))}
                        </CourseBox>
                      </AccordionDetails>
                    </AccordionStyled>
                  ))}
                </AccordionDetails>
              )}
            </AccordionStyled>
          ))}
        </AccordionContainer>
      </Grid>
    </Grid>
  );
};

export default ContentPage;