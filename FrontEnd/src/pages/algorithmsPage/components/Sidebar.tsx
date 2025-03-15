import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  Button,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";

// Ширина бокового меню
const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    position: "relative",
    scrollbarWidth: "none", 
    "&::-webkit-scrollbar": {
      display: "none", 
    },
  },
}));

const StyledButtonExit = styled(Button)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  color: theme.palette.error.main,
  width: "100%",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "inherit",
    transform: "scale(1.03)",
  },
}));

const menuData = [
  {
    title: "Структуры данных и алгоритмы обработки диапазонов",
    subSections: [
      {
        title: "Дерево отрезков (ДО)",
        subSubSections: [
          "Дерево отрезков с суммами",
          "Дерево отрезков с минимальными/максимальными значениями",
          "Дерево отрезков с добавлением модификаторов (range update)",
        ],
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
    subSections: [],
  },
];

const SidebarMenu: React.FC = () => {
  const theme = useTheme();
  // Открытие/закрытие бокового меню на мобильных
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");

  // Управляем раскрытием аккордеонов
  const [openSection, setOpenSection] = useState<boolean[]>(menuData.map(() => false));
  const [openSubSection, setOpenSubSection] = useState<boolean[][]>(
    menuData.map((section) => section.subSections.map(() => false))
  );

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const toggleSection = (index: number) => {
    setOpenSection((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  const toggleSubSection = (sectionIndex: number, subIndex: number) => {
    setOpenSubSection((prev) =>
      prev.map((subArr, i) =>
        i === sectionIndex
          ? subArr.map((isOpen, j) => (j === subIndex ? !isOpen : isOpen))
          : subArr
      )
    );
  };

  // Контент внутри Drawer
  const drawerContent = (
    <div>
      <Typography
        sx={{
          color: theme.palette.grey[500],
          padding: theme.spacing(2),
        }}
      >
        СОДЕРЖАНИЕ
      </Typography>

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
            <Typography sx={{ color: theme.palette.purple.dark }}>
              {section.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
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
                          {subSection.subSubSections.map((subSubSection, sssIndex) => (
                            <ListItemButton
                              key={sssIndex}
                              sx={{
                                borderRadius: theme.shape.borderRadius,
                                "&:hover": {
                                  backgroundColor: `rgba(${theme.palette.purple.contrastText}, 0.85)`,
                                },
                              }}
                            >
                              <Typography>{subSubSection}</Typography>
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

      <StyledButtonExit startIcon={<ExitToAppOutlinedIcon />}>
        Вернуться к содержанию
      </StyledButtonExit>
    </div>
  );

  return (
    <>
      {/* Кнопка гамбургера для мобильных */}
      {isMobile && (
        <IconButton
          onClick={() => toggleDrawer(true)}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Сам Drawer (выдвижная панель) */}
      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={() => toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // улучшает производительность на мобильных
        }}
      >
        {drawerContent}
      </StyledDrawer>
    </>
  );
};

export default SidebarMenu;
