// import logo from './logo.svg';
import React, {useState, lazy, Suspense} from "react";
import './globalStyles/App.scss';
import Header from './components/header/Header';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";

const HeroSection = lazy(() => import('./pages/mainPage/HeroSection/HeroSection'));
const CoursePage = lazy(() => import('./pages/coursePage/CoursePage'));
const AboutPage = lazy(() => import('./pages/aboutPage/aboutPage'));
const AlgorithmsPage = lazy(() => import('./pages/algorithmsPage/algorithmsPage'));


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Header />
          <Suspense fallback={
            <div>Loading223...</div>
          }>
            <Routes>
              <Route path="/" element={<HeroSection/>} />
              <Route path="/CourseContent" element={<CoursePage/>} />
              <Route path="/AboutPage" element={<AboutPage/>} />
              <Route path="/algorithmsPage" element={<AlgorithmsPage/>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
