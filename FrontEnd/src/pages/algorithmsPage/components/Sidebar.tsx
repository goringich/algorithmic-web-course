import React, { useState } from "react";
import {Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItemButton, Grid2, Button, useMediaQuery, Drawer, IconButton} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from '@mui/system';
import { useTheme } from "@mui/material/styles";


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
const Content = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  paddingLeft: theme.spacing(2),
  paddingTop: theme.spacing(2),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  height: "100vh",
  "& .MuiDrawer-paper": {
    width: "75vw",
    position: "relative",
    scrollbarWidth: "none", // Firefox
    "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge

    [theme.breakpoints.up("md")]: {
      width: "auto", 
    },
  },
}));

const StyledButtonExit = styled(Button)(({ theme }) =>({
  paddingBottom: theme.spacing(3),
  color: theme.palette.error.main,
  width: "100%",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {backgroundColor: "inherit", 
    transform: "scale(1.03)"}
}));

const SidebarMenu: React.FC = () => {

  const theme = useTheme();
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
 
  return (
    <Grid2 container spacing={1}
    sx={{
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

      <Grid2 size={{sm: 3}}>
        <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"} // temporary для мобильных, permanent для десктопов
        open={isMobile ? open : true} // Открыто постоянно для десктопов
        onClose={() => toggleDrawer(false)}
        >
          <Content>
            СОДЕРЖАНИЕ
          </Content>
          <Grid2 sx = {{flexGrow: "1"}}>
            {menuData.map((section, index) => (
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
                  <Typography sx={{color: theme.palette.purple.dark}}>{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {/* создание аккордеонов для подсекций */}
                    {section.subSections.map((subSection, subIndex) => {
                      if (typeof subSection === "string") {
                        return (
                          <ListItemButton key={subIndex}>
                            <Typography> {subSection} </Typography>
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
                              <Typography> {subSection.title} </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <List>
                                {/* Динамическое создание аккордеонов для подподсекций */}
                                {subSection.subSubSections.map((subSubSection, subSubIndex) => (
                                  <ListItemButton key={subSubIndex}
                                   sx ={{borderRadius: theme.shape.borderRadius, 
                                   "&:hover" : {backgroundColor: `rgba(${theme.palette.purple.contrastText}, 0.85)`}}}>
                                    <Typography> {subSubSection} </Typography>
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
          </Grid2>
          
          <Grid2>
            <StyledButtonExit
            startIcon={<ExitToAppOutlinedIcon />}
            >
            Вернуться к содержанию
            </StyledButtonExit>
          </Grid2>
      </StyledDrawer>
    </Grid2>
    </Grid2>
  );
};

export default SidebarMenu;
