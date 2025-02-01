import React, { useState } from "react";
import styles from "../algorithmsPage.module.scss";
import SubSectionList from "./SubSectionList";
import {Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Grid2} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Section } from "./types/types";

interface SidebarProps {
  contents: Section[];
  onSectionSelect: (section: Section) => void;
}
const menuData = [
  {
    title: "Структуры данных и алгоритмы обработки диапазонов",
    subSections: [
      {
        title: "Дерево отрезков (ДО)",
        subSubSections: ["Дерево отрезков с суммами",
          "Дерево отрезков с минимальными/максимальными значениями",
          "Дерево отрезков с добавлением модификаторов (range update)"],
      },
      {
        title: "Дерево Фенвика",
        subSubSections: ["Подсекция 1", "Подсекция 2"],
      },
    ],
  },
  {
    title: "Алгоритмы",
    subSections: [
      {
        title: "Короткие пути",
        subSubSections: ["Подсекция 1", "Подсекция 2"],
      },
      {
        title: "Декомпозиционные методы",
        subSubSections: ["Подсекция 1", "Подсекция 2"],
      },
    ],
  },
];

const SidebarMenu: React.FC = () => {
  const [openSection, setOpenSection] = useState<boolean[]>(menuData.map(() => false));;
  const [openSubSection, setOpenSubSection] = useState<boolean[][]>(
    menuData.map(section => section.subSections.map(() => false))
  );

  const toggleSection = (index: number) => {
    setOpenSection(prevState =>
      prevState.map((isOpen, i) => (i === index ? !isOpen : isOpen)))
  };

  const toggleSubSection = (sectionIndex: number, subIndex: number) => {
    setOpenSubSection(prevState =>
      prevState.map((subSections, i) =>
        i === sectionIndex
          ? subSections.map((isOpen, j) => (j === subIndex ? !isOpen : isOpen))
          : subSections
      ))
  };


  return (
    <Grid2 container direction="column" // Расположение элементов в колонку
    alignItems="flex-start" // Прижимаем элементы к левому краю
    sx={{
      borderRight: "1px solid #ddd", // Вертикальная линия для визуального отделения
      minHeight: "100vh", // Растягиваем меню на всю высоту экрана
      boxShadow: "3",
      width: "20vw"
    }} >
      <Typography className={styles.content}>
        СОДЕРЖАНИЕ
      </Typography>
      {/* Динамическое создание аккордеонов для секций */}
      {menuData.map((section, index) => (
        <Accordion
          key={index}
          disableGutters
          elevation={0}
          keyexpanded={openSection[index]}
          onChange={() => toggleSection(index)}
          sx={{
            background: "none",
            "&::before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            // sx={{
            //   display: "flex",
            //   justifyContent: "space-between", // Располагаем элементы с отступами // Обеспечиваем, что аккордеон займет всю ширину
            //   '& .MuiAccordionSummary-content': {
            //     marginRight: '4px', // Добавляем отступ для текста от стрелки
            //   },
            //   '& .MuiAccordionSummary-expandIconWrapper': {
            //     marginLeft: 'auto', // Перемещаем стрелку в крайний правый угол
            //   },
            // }}
          >
            <Typography className={styles.style_for_text_section}>{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {/* Динамическое создание аккордеонов для подсекций */}
              {section.subSections.map((subSection, subIndex) => {
                if (typeof subSection === "string") {
                  return (
                    <ListItem button key={subIndex}>
                      <ListItemText primary={subSection} />
                      {/* primary={<Typography className={styles.style_for_text_subsection}>subSection</Typography>} /> */}
                    </ListItem>
                  );
                } else {
                  return (
                    <Accordion
                      key={subIndex}
                      disableGutters
                      elevation={0}
                      expanded={openSubSection[index][subIndex]}
                      onChange={() => toggleSubSection(index, subIndex)}
                      sx={{
                        background: "none",
                        "&::before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-${subIndex}-content`}
                        id={`panel${index}-${subIndex}-header`}
                        // sx={{
                        //   display: "flex",
                        //   justifyContent: "space-between", // Стрелка слева, текст справа
                        //   '& .MuiAccordionSummary-content': {
                        //     marginRight: '4px', // Добавляем отступ для текста от стрелки
                        //   },
                        // }} 
                      >
                        <Typography className={styles.style_for_text_subsection}>{subSection.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {/* Динамическое создание аккордеонов для подподсекций */}
                          {subSection.subSubSections.map((subSubSection, subSubIndex) => (
                            <ListItem button key={subSubIndex}>
                              <ListItemText primary={subSubSection} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

    </Grid2>
  );
};

export default SidebarMenu;
// const Sidebar: React.FC<SidebarProps> = ({ contents, onSectionSelect }) => {
//   return (
//     <nav className={styles.sidebar}>
//       <h3>Содержание</h3>
//       {contents.map((section, index) => (
//         <div key={index}>
//           <button
//             onClick={() => onSectionSelect(section)}
//             className={styles.section}
//           >
//             {section.title}
//           </button>
//           <SubSectionList subSections={section.subSection} onSectionSelect={onSectionSelect} />
//         </div>
//       ))}
//       <button className={styles.back_button}>
//         Вернуться к содержанию
//       </button>
//     </nav>
//   );
// };

// export default Sidebar;
