import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Fab,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import { Theme } from "@mui/material/styles";
import menuData from "../../assets/dataBase/menuData";
import FAQData from "../../assets/dataBase/TitlesData copy.json";

const FabButton = styled(Fab)(({ theme }) => ({
  width: "50px",
  height: "50px",
  background: theme.palette.background.card,
  fontSize: "16px",
  color: theme.palette.text.primary,
  marginRight: theme.spacing(4),
}));

const CustomSubtitle = styled("h2")<{ theme?: Theme }>(({ theme }) => ({
  fontFamily: theme?.typography.fontFamily,
  fontWeight: 500,
  color: theme?.palette.text.primary,
  overflowWrap: "break-word",
  wordBreak: "break-word",
}));

const AccordionContainer = styled(Paper)<{ theme?: Theme }>(({ theme }) => ({
  width: "100%",
  maxWidth: 900,
  background: theme?.palette.background.cardContent,
  borderRadius: theme?.shape.cardRadius,
  padding: theme.spacing(3),
  margin: "40px auto",

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
}));


const AccordionStyled = styled(Accordion)<{ theme?: Theme }>(({ theme }) => ({
  background: theme?.palette.background.cardContent,
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
}));

const CourseBox = styled("ul")<{ theme?: Theme }>(({ theme }) => ({
  width: "100%",
  padding: "15px",
  background: theme?.palette.background.card,
  borderRadius: theme?.shape.cardRadius,
  listStyle: "none",

  "& a": {
    color: theme?.palette.purple.main,
    textDecoration: "none",
  },

  "& a:hover": {
    textDecoration: "underline",
  },
}));

const ListItem = styled("li")(({ theme }) => ({
  fontSize: "18px",
  marginBottom: "5px",
  color: theme?.palette.text.primary,
}));

interface ContentPageProps {
  fileName: string;
  title: string;
}

const ContentPage: React.FC<ContentPageProps> = ({ fileName, title }) => {
  const [content, setContent] = useState<any[] | null>(null);
  const [openSection, setOpenSection] = useState<number | null>(null);

  useEffect(() => {
    if (fileName === "CourseData.json") {
      setContent(menuData);
    } else if (fileName === "TitlesData copy.json") {
      setContent(FAQData);
    }
  }, [fileName]);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  if (!content) return <div>Загрузка...</div>;

  return (
    <Grid container justifyContent="center">
      <AccordionContainer elevation={3}>
        {content.map((section, index) => (
          <AccordionStyled
            key={index}
            expanded={openSection === index}
            onChange={() => toggleSection(index)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid
                container
                alignItems="center"
                spacing={2}
                sx={{ flexWrap: "nowrap", minWidth: 0, gap: 1 }}
              >
                <Grid sx={{ flexShrink: 0 }}>
                  <FabButton size="small">{index + 1}</FabButton>
                </Grid>
                <Grid sx={{ flexGrow: 1, minWidth: 0 }}>
                  <CustomSubtitle
                    style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
                  >
                    {section.title}
                  </CustomSubtitle>
                </Grid>
              </Grid>
            </AccordionSummary>

            {section.subSections.length > 0 && (
              <AccordionDetails sx={{ px: 4 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <CourseBox>
                      {section.subSections.map((sub, idx) => (
                        <ListItem key={idx}>
                          <strong>{sub.title}</strong>
                          {sub.subSubSections && (
                            <ul>
                              {sub.subSubSections.map(
                                ([subTitle, url], subIdx) => (
                                  <li key={subIdx}>
                                    <Link to={`/algorithmsPage/${url}`}>
                                      {subTitle}
                                    </Link>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </ListItem>
                      ))}
                    </CourseBox>
                  </Grid>
                </Grid>
              </AccordionDetails>
            )}
          </AccordionStyled>
        ))}
      </AccordionContainer>
    </Grid>
  );
};

export default ContentPage;
