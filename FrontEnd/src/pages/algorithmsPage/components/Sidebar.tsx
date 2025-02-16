import React, { useState } from "react";
import styles from "../algorithmsPage.module.scss";
import {Box, Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItemButton, ListItemText, Grid2, Button, useMediaQuery, Drawer, IconButton} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Section } from "./types/types";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from '@mui/system';

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
    subSections: [],
  },
  {
    title: "Декомпозиционные методы",
    subSections: [ ],
  },
];

const SidebarMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)"); // Условие для мобильных устройств

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

  const Content = styled(Typography) ({
    fontFamily: 'var(--primary-font)',
    color: 'var(--grey)',
    paddingLeft: '4%',
    paddingTop: '4%',
  });

  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    height: "100vh",
    "& .MuiDrawer-paper": {
      width: "75vw",
      boxSizing: "border-box",
      position: "relative",
      display: "flex",
      overflowY: "scroll",
      scrollbarWidth: "none", // Firefox
      "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
  
      [theme.breakpoints.up("md")]: {
        width: "auto", 
      },
    },
  }));

  const Typography_for_sections = styled(Typography)({
    fontFamily: 'var(--primary-font)'
  })

  const Styled_button_exit = styled(Button)({
    marginTop: "auto",
    display: "flex",
    paddingBottom: "12px",
    fontFamily: "var(--primary-font)",
    textTransform: "none",
    color: "var(--red)",
    width: "100%",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {backgroundColor: "inherit", 
      transform: "scale(1.03)"}
  })
 
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
        <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"} // temporary для мобильных, permanent для десктопов
        open={isMobile ? open : true} // Открыто постоянно для десктопов
        onClose={() => toggleDrawer(false)}
        >
          <Content>
            СОДЕРЖАНИЕ
          </Content>
          <Grid2>
          {menuData.map((section, index) => (
            <Grid2 key={index}>  
            <Accordion
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
                <Typography_for_sections sx={{color: "var(--grey_purple)"}}>{section.title}</Typography_for_sections>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {/* создание аккордеонов для подсекций */}
                  {section.subSections.map((subSection, subIndex) => {
                    if (typeof subSection === "string") {
                      return (
                        <ListItemButton key={subIndex}>
                          <Typography_for_sections> {subSection} </Typography_for_sections>
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
                            <Typography_for_sections> {subSection.title} </Typography_for_sections>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List>
                              {/* Динамическое создание аккордеонов для подподсекций */}
                              {subSection.subSubSections.map((subSubSection, subSubIndex) => (
                                <ListItemButton key={subSubIndex} sx ={{borderRadius: "8px", "&:hover" : {backgroundColor: "rgba(var(--light_violent), 0.85)"}}}>
                                  <Typography_for_sections> {subSubSection} </Typography_for_sections>
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
            </Grid2>
          ))}
          </Grid2>
          
          <Box >
            <Styled_button_exit
            startIcon={<ExitToAppOutlinedIcon />}
            >
            Вернуться к содержанию
            </Styled_button_exit>
          </Box>
      </StyledDrawer>
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
