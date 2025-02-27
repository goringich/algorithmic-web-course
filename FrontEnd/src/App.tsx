import React, {useState, lazy, Suspense} from "react";
import './globalStyles/App.scss';
import Header from './components/header/HeaderForMainPage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import { ThemeProviderWrapper } from "./context/ThemeContext";
import AlternateHeader from './components/header/Header';


const HeroSection = lazy(() => import('./pages/mainPage/HeroSection/HeroSection'));
const CoursePage = lazy(() => import('./pages/coursePage/CoursePage'));
const AboutPage = lazy(() => import('./pages/aboutPage/aboutPage'));
const AlgorithmsPage = lazy(() => import('./pages/algorithmsPage/algorithmsPage'));

function Layout() {
  const location = useLocation();

  // Проверяем путь и выбираем нужный заголовок
  const isSpecialPage = location.pathname === "/";
  return (
    <>
      {isSpecialPage ? <Header /> : <AlternateHeader />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/CourseContent" element={<CoursePage />} />
          <Route path="/AboutPage" element={<AboutPage />} />
          <Route path="/algorithmsPage" element={<AlgorithmsPage />} />
        </Routes>
      </Suspense>
    </>
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
