// import logo from './logo.svg';
import React, {useState, lazy, Suspense} from "react";
import './globalStyles/App.scss';
import Header from './components/header/Header';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const HeroSection = lazy(() => import('./pages/mainPage/HeroSection/HeroSection'));
const CoursePage = lazy(() => import('./pages/coursePage/CoursePage'));
const AboutPage = lazy(() => import('./pages/aboutPage/aboutPage'));
const AlgorithmsPage = lazy(() => import('./pages/algorithmsPage/algorithmsPage'));


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
          <Suspense fallback={
            <div>Loading...</div>
          }>
            <Routes>
              <Route path="/" element={<HeroSection/>} />
              <Route path="/CourseContent" element={<CoursePage/>} />
              <Route path="/AboutPage" element={<AboutPage/>} />
              <Route path="/AboutPage" element={<AboutPage/>} />
              <Route path="/algorithmsPage" element={<AlgorithmsPage/>} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
