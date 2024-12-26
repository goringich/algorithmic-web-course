// import logo from './logo.svg';
import React, {useState, useEffect, createContext} from "react";
import './globalStyles/App.scss';
import Header from './components/header/Header';
import { ThemeProvider } from './context/ThemeContext';
import HeroSection from './pages/mainPage/HeroSection/HeroSection';
import CoursePage from './pages/coursePage/CoursePage';
import AboutPage from './pages/aboutPage/aboutPage';
import AlgorithmsPage from './pages/algorithmsPage/algorithmsPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  }

  return (
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* ${isDarkTheme ? "dark-theme" : "light-theme"} */}
        <div className={`App `}>
          <Header toggleTheme={toggleTheme}/>
          <Routes>
            <Route path="/" element={<HeroSection/>} />
            <Route path="/CourseContent" element={<CoursePage/>} />
            <Route path="/AboutPage" element={<AboutPage/>} />
            <Route path="/AboutPage" element={<AboutPage/>} />
            <Route path="/algorithmsPage" element={<AlgorithmsPage/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
