import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Paper, Fab } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from './FAQPage.module.scss';
import courseContent from "../../assets/dataBase/TitlesData.json";
import Grid from '@mui/material/Grid2';

const FAQPage: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <Grid container justifyContent="center" className={styles.faq__content}>
      <Grid size={{ xs: 12 }}>
        <h4 className={styles.customTitle}>Вопросы</h4>
      </Grid>

      <Grid size={{ xs: 12, md: 10, lg: 8 }}>
        <Paper elevation={3} className={styles.accordionContainer}>
          {courseContent.map((_, index) => (
            <Accordion
              key={index}
              expanded={openQuestion === index}
              onChange={() => toggleQuestion(index)}
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
                      Вопрос
                    </h2>
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails className={styles.accordionDetails} sx={{ paddingLeft: 4, paddingRight: 4 }}>
                <Grid container>
                  <Grid size={{ xs: 12 }}>
                    <ul className={styles.course__box}>
                      {courseContent[index].subSections.map((sub, idx) => (
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

export default FAQPage;
