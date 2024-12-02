// import logo from './logo.svg';
import React, {useState, useEffect, createContext} from "react";
import './globalStyles/App.scss';
import Header from './components/header/Header';
import { ThemeProvider } from './context/ThemeContext';
import HeroSection from './components/mainPage/HeroSection/HeroSection';
import CoursePage from './components/coursePage/CoursePage';
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
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
