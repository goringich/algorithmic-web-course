import React, {useState, lazy, Suspense} from "react";
import './globalStyles/App.scss';
import Header from './components/header/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import { ThemeProviderWrapper } from "./context/ThemeContext";

const HeroSection = lazy(() => import('./pages/mainPage/HeroSection/HeroSection'));
const CoursePage = lazy(() => import('./pages/coursePage/CoursePage'));
const AboutPage = lazy(() => import('./pages/aboutPage/aboutPage'));
const AlgorithmsPage = lazy(() => import('./pages/algorithmsPage/algorithmsPage'));


function App() {
  //return <div>Просто текст для теста</div>;
  return (
    <ThemeProviderWrapper>
      <ErrorBoundary>
        <BrowserRouter>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/CourseContent" element={<CoursePage />} />
              <Route path="/AboutPage" element={<AboutPage />} />
              <Route path="/algorithmsPage" element={<AlgorithmsPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProviderWrapper>
  );
}

export default App;
