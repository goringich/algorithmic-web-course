import React, { useState, useEffect } from "react";
import {Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItemButton, Grid2, Button, useMediaQuery, Drawer, IconButton} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from '@mui/system';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useSection } from "../../../context/SectionContext";
import { useSubSubSection } from "../../../context/subSubSectionContext";
import menuData from "../../../assets/dataBase/menuData";


const Content = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  paddingLeft: theme.spacing(2),
  paddingTop: theme.spacing(2),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  height: "100%",
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

const SidebarMenu = () => {
  const navigate = useNavigate(); 
  const { subSubSection: urlSubSubSection } = useParams(); 
  const { setActiveSection } = useSection();
  const { setActiveSubSubSection } = useSubSubSection();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)"); 

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

  const [openSubSubSection, setOpenSubSubSection] = useState<{ sectionIndex: number; subIndex: number; subSubIndex: number } | null>(null);

  const toggleSubSubSection = (sectionIndex: number, subIndex: number, subSubIndex: number) => {
    setOpenSubSubSection({ sectionIndex, subIndex, subSubIndex });
  };

  useEffect(() => {
    const [sectionTitle, subSectionTitle, subSubSectionId] = urlSubSubSection?.split("/") ?? [];

    menuData.forEach((section, sectionIndex) => {
      section.subSections.forEach((subSection, subIndex) => {
        if (subSection.subSubSections) {
          subSection.subSubSections.forEach((subSubSection, subSubIndex) => {
            // Сравниваем id подподсекции с тем, что есть в URL
            if (subSubSection[1] === subSubSectionId) {
              setActiveSection(section.title);
              setActiveSubSubSection(subSubSection);

              // Открываем аккордеоны и подподсекции
              setOpenSection(prev => prev.map((isOpen, i) => (i === sectionIndex ? true : isOpen)));
              setOpenSubSection(prev =>
                prev.map((subSections, i) =>
                  i === sectionIndex
                    ? subSections.map((isOpen, j) => (j === subIndex ? true : isOpen))
                    : subSections
                )
              );
              setOpenSubSubSection({ sectionIndex, subIndex, subSubIndex });
            }
          });
        }
      });
    });
  }, [urlSubSubSection]);
 
  return (
    <Grid2 sx={{height: "100%", width: "100%"}}>
      {isMobile && (
        <IconButton
          onClick={() => toggleDrawer(true)}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}
        <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"} 
        open={isMobile ? open : true}
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
                              <Typography sx={{color: openSubSection[index][subIndex] ? theme.palette.purple.light : "inherit"}}> {subSection.title} </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <List>
                                {/* Динамическое создание аккордеонов для подподсекций */}
                                {subSection.subSubSections.map((subSubSection, subSubIndex) => (
                                  <ListItemButton key={subSubIndex}
                                    onClick={() => { toggleSubSubSection(index, subIndex, subSubIndex);
                                      setActiveSection(section.title);
                                      setActiveSubSubSection(subSubSection);
                                      navigate(`/algorithmsPage/${subSubSection[1]}`);
                                    }}
                                    sx ={{borderRadius: theme.shape.borderRadius, 
                                    "&:hover" : {backgroundColor: `rgba(${theme.palette.purple.onHover}, 0.85)`},
                                    backgroundColor: openSubSubSection &&
                                    openSubSubSection.sectionIndex === index &&
                                    openSubSubSection.subIndex === subIndex &&
                                    openSubSubSection.subSubIndex === subSubIndex
                                    ? theme.palette.purple.toClick
                                    : "inherit",
                                  boxShadow: openSubSubSection &&
                                    openSubSubSection.sectionIndex === index && 
                                    openSubSubSection.subIndex === subIndex &&
                                    openSubSubSection.subSubIndex === subSubIndex
                                    ? "2"
                                    : "inherit"}}>
                                    <Typography> {subSubSection[0]} </Typography>
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
            <Link to="/CourseContent">
              <StyledButtonExit
              startIcon={<ExitToAppOutlinedIcon />}
              >
              Вернуться к содержанию
              </StyledButtonExit>
            </Link>
          </Grid2>
      </StyledDrawer>
    </Grid2>
 );
};

export default SidebarMenu;