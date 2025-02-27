// import logo from './logo.svg';
import React, {useState, lazy, Suspense} from "react";
import './globalStyles/App.scss';
import Header from './components/header/Header';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const HeroSection = lazy(() => import('./pages/mainPage/HeroSection/HeroSection'));
const CoursePage = lazy(() => import('./pages/coursePage/CoursePage'));
const AboutPage = lazy(() => import('./pages/aboutPage/aboutPage'));
const FAQPage = lazy(() => import('./pages/FAQPage/FAQPage'));
const AlgorithmsPage = lazy(() => import('./pages/algorithmsPage/algorithmsPage'));


function App() {
  return (
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
            <Route path="/FAQPage" element={<FAQPage/>} />
            <Route path="/algorithmsPage" element={<AlgorithmsPage/>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
