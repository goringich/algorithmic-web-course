import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Paper, Fab } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from './CoursePage.module.scss';
import courseContent from "../../assets/dataBase/TitlesData.json";
import Grid from '@mui/material/Grid2';

const CourseContent: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <Grid container justifyContent="center" className={styles.course__content}>
      <Grid size={{ xs: 12 }}>
        <h4 className={styles.customTitle}>Содержание курса</h4>
      </Grid>

      <Grid size= {{xs: 12, md: 10, lg:8}}>
        <Paper elevation={3} className={styles.accordionContainer}>
          {courseContent.map((section, index) => (
            <Accordion
              key={index}
              expanded={openSection === index}
              onChange={() => toggleSection(index)}
              className={styles.accordion}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles.accordionSummary}>
                <Grid container alignItems="center" spacing={2} sx={{ flexWrap: "noWrap", minWidth: 0, gap: 1 }}>
                  <Grid sx={{ flexShrink: 0 }}>
                    <Fab size="small" className={styles.fabButton}>
                      {index + 1}
                    </Fab>
                  </Grid>
                  <Grid sx={{ flexGrow: 1, minWidth: 0 }}>
                    <h2
                      className={styles.customSubtitle}
                      style={{
                        fontSize: "clamp(1rem, 2vw, 1.5rem)",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      {section.title}
                    </h2>
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails className={styles.accordionDetails} sx={{ paddingLeft: 4, paddingRight: 4 }}>
                <Grid container>
                  <Grid size ={{ xs: 12 }}>
                    <ul className={styles.course__box}>
                      {section.subSections.map((sub, idx) => (
                        <li
                          key={idx}
                          className={styles.listItem}
                          style={{
                            fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CourseContent;
