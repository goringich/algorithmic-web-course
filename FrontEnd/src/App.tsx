import React, {useState, lazy, Suspense} from "react";
import Header from './components/header/HeaderForMainPage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import { ThemeProviderWrapper } from "./context/ThemeContext";
import AlternateHeader from './components/header/Header';
import {Box} from "@mui/material";


const HeroSection = lazy(() => import('./pages/mainPage/HeroSection/HeroSection'));
const CoursePage = lazy(() => import('./pages/coursePage/CoursePage'));
const AboutPage = lazy(() => import('./pages/aboutPage/aboutPage'));
const FAQPage = lazy(() => import('./pages/FAQPage/FAQPage'));
const AlgorithmsPage = lazy(() => import('./pages/algorithmsPage/algorithmsPage'));

function Layout() {
  const location = useLocation();
  const isSpecialPage = location.pathname === "/";

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh" 
    }}>
      {isSpecialPage ? <Header /> : <AlternateHeader />}

      <Box sx={{ flexGrow: 1 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/CourseContent" element={<CoursePage />} />
            <Route path="/AboutPage" element={<AboutPage />} />
            <Route path="/FAQPage" element={<FAQPage />} />
            <Route path="/algorithmsPage" element={<AlgorithmsPage />} />
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
          <Layout />
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProviderWrapper>
  );
}

export default App;
