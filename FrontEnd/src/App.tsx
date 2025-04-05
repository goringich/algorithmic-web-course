import React, { useState, lazy, Suspense } from "react";
import Header from './components/header/HeaderForMainPage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import { ThemeProviderWrapper } from "./context/ThemeContext";
import AlternateHeader from './components/header/Header';
import {Box} from "@mui/material";
import { SectionProvider } from "./context/SectionContext";
import { SubSubSectionProvider } from "./context/subSubSectionContext";

const HeroSection = lazy(() => import('./pages/mainPage/HeroSection/HeroSection'));
const AboutPage = lazy(() => import('./pages/aboutPage/aboutPage'));
const AlgorithmsPage = lazy(() => import('./pages/algorithmsPage/algorithmsPage'));
const ContentPage = lazy(() => import('./pages/ContentPage/ContentPage')); 

function Layout() {
  const location = useLocation();
  const isSpecialPage = location.pathname === "/";

  return (    
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh" 
    }}>
      {isSpecialPage ? <Header/> : <AlternateHeader/>}

      <Box sx={{ flexGrow: 1 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/CourseContent" element={<ContentPage fileName="CourseData.json" title="Курс" />} />
            <Route path="/AboutPage" element={<AboutPage />} />
            <Route path="/FAQPage" element={<ContentPage fileName="TitlesData copy.json" title="FAQ" />} />
            <Route path="/algorithmsPage/:subSubSection" element={<AlgorithmsPage />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
}


function App() {
  return (
    <ThemeProviderWrapper>
      <ErrorBoundary>
        <BrowserRouter>
          <SectionProvider>
            <SubSubSectionProvider>
              <Layout />
            </SubSubSectionProvider>
          </SectionProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProviderWrapper>
  );
}

export default App;
