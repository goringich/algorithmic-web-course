import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Paper, Fab } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import courseContent from "../../assets/dataBase/TitlesData.json";
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/system';
import { Theme } from "@mui/material/styles";

const FabButton = styled(Fab)(({ theme }) => ({
  width: "50px",
  height: "50px",
  background: theme.palette.background.card,
  fontSize: "16px",
  color: theme.palette.text.primary,
  marginRight: theme.spacing(4),
}));

const CustomSubtitle = styled("h2") <{ theme: Theme }> (({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 500,
  color: theme.palette.text.primary,
  overflowWrap: "break-word",
  wordBreak: "break-word",
}));

const AccordionContainer = styled(Paper)<{ theme: Theme }>(({ theme }) => ({
  width: "100%",
  background: theme.palette.background.paper,
  borderRadius: theme.shape.cardRadius,
  padding: "20px",
  margin: "20px auto",
  flexDirection: "column",
}));

const AccordionStyled = styled(Accordion)(() => ({
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
}));

const CourseBox = styled("ul") <{ theme: Theme }> (({ theme }) => ({
  width: "100%",
  padding: "15px",
  background: theme.palette.background.card,
  borderRadius: theme.shape.cardRadius,
  listStyle: "none",
}));

const ListItem = styled("li")(({ theme }) => ({
  fontSize: "18px",
  marginBottom: "5px",
  color: theme.palette.text.primary,
}));

const CourseContent: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <Grid container justifyContent="center">
      <Grid size= {{xs: 12, md: 10, lg:8}}>
        <AccordionContainer elevation={3}>
          {courseContent.map((section, index) => (
            <AccordionStyled
              key={index}
              expanded={openSection === index}
              onChange={() => toggleSection(index)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center" spacing={2} sx={{ flexWrap: "noWrap", minWidth: 0, gap: 1 }}>
                  <Grid sx={{ flexShrink: 0 }}>
                  <FabButton size="small">{index + 1}</FabButton>
                  </Grid>
                  <Grid sx={{ flexGrow: 1, minWidth: 0 }}>
                    <CustomSubtitle
                      style={{
                        fontSize: "clamp(1rem, 2vw, 1.5rem)",
                      }}
                    >
                      {section.title}
                    </CustomSubtitle>
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails sx={{ paddingLeft: 4, paddingRight: 4 }}>
                <Grid container>
                  <Grid size ={{ xs: 12 }}>
                    <CourseBox>
                      {section.subSections.map((sub, idx) => (
                        <ListItem
                          key={idx}
                        >
                          {sub}
                        </ListItem>
                      ))}
                    </CourseBox>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </AccordionStyled>
          ))}
        </AccordionContainer>
      </Grid>
    </Grid>
  );
};

export default CourseContent;
