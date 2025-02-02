import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from './CoursePage.module.scss';
import courseContent from "../../assets/dataBase/TitlesData.json";

const CourseContent: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const isUnderlined = (text: string) => {
    const underlinedItems = [
      "Дерево отрезков (ДО)",
      "Дерево Фенwick",
      "Процесс дерева отрезков",
      "Ленивое дерево отрезков"
    ];
    return underlinedItems.includes(text.trim());
  };

  return (
    <div className={styles.course__content}>
      <h4 className={styles.customTitle}>Содержание курса</h4>
      
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '1040px',
          background: 'rgba(208, 188, 255, 0.15)',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '20px',
          padding: '20px',
          margin: '20px auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
        }}
      >
        {courseContent.map((section, index) => (
          <Accordion
            key={index}
            expanded={openSection === index}
            onChange={() => toggleSection(index)}
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: 'none',
              margin: '0',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={styles.accordion__summary}
              sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderBottom: 'none',
                margin: '0',
              }}
            >
              <div className={styles.circle}>
                <span className={styles.number}>{index + 1}</span>
              </div>
              <h2 className={styles.customSubtitle}>{section.title}</h2>
            </AccordionSummary>
            <AccordionDetails 
              sx={{ 
                backgroundColor: 'transparent', 
                boxShadow: 'none', 
                borderBottom: 'none',
              }}
            >
              <ul className={styles.course__box}>
                {section.subSections.map((sub, idx) => (
                  <li
                    key={idx}
                    className={`${styles.listItem} ${isUnderlined(sub) ? styles.underlined : styles._listItem_1hgjm_54}`}
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </div>
  );
};

export default CourseContent;
