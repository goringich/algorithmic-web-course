import React, { useState } from "react";
import styles from "../algorithmsPage.module.scss";
import {Box, Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItemButton, ListItemText, Grid2, Button, useMediaQuery, Drawer, IconButton} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Section } from "./types/types";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import MenuIcon from "@mui/icons-material/Menu";

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
      {
        title: "Простое дерево отрезков",
        subSubSections: [],
      },
      {
        title: "Ленивое дерево отрезков",
        subSubSections: [],
      },
    ],
  },
  {
    title: "Алгоритмы обработки координат и анализа пространственных данных",
    subSections: [ ],
  },
  {
    title: "Декомпозиционные методы",
    subSections: [ ],
  },
];

const SidebarMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 800px)"); // Условие для мобильных устройств

  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  };
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
    <Grid2 container spacing={1}
    sx={{
      minHeight: "100vh", // Растягиваем меню на всю высоту экрана
      width: "100vw"
    }}>
      {/* Для мобильных устройств - кнопка меню */}
      {isMobile && (
        <IconButton
          onClick={() => toggleDrawer(true)}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Grid2 size={{sm: 2.5}}
      sx={{height: "100vh"}}>
        <Drawer
        variant={isMobile ? "temporary" : "permanent"} // temporary для мобильных, permanent для десктопов
        open={isMobile ? open : true} // Открыто постоянно для десктопов
        onClose={() => toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "75vw", sm: "75vw", md: "auto"}, // 75% экрана на мобильных, авто на десктопе
            boxSizing: "border-box", // Учитываем padding в ширине
            position: "relative",
            display: "flex",
            overflowY: "scroll",
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
            },
        }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}>
            <Typography className={styles.content}>
              СОДЕРЖАНИЕ
            </Typography>
          <Box sx={{flexGrow: 1}}> 
            {menuData.map((section, index) => (
              <Accordion
                key={index}
                disableGutters
                elevation={0}
                expanded={openSection[index]}
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
                >
                  <Typography className={styles.style_for_text_section}>{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {/* Динамическое   создание аккордеонов для подсекций */}
                    {section.subSections.map((subSection, subIndex) => {
                      if (typeof subSection === "string") {
                        return (
                          <ListItemButton key={subIndex}>
                            <ListItemText primary={subSection} />
                          </ListItemButton>
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
                            >
                              <Typography className={styles.style_for_text_subsection}> {subSection.title} </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <List>
                                {/* Динамическое создание аккордеонов для подподсекций */}
                                {subSection.subSubSections.map((subSubSection, subSubIndex) => (
                                  <ListItemButton key={subSubIndex} className={styles.background_on_hover}>
                                    <ListItemText primary={subSubSection} 
                                    primaryTypographyProps={{ className: styles.style_for_text_subsection }} />
                                  </ListItemButton>
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
            </Box>
            <Box >
              <Button className={styles.button_exit}
              startIcon={<ExitToAppOutlinedIcon />}
              >
              Вернуться к содержанию
              </Button>
            </Box>
          </Box>
      </Drawer>
    </Grid2>
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
