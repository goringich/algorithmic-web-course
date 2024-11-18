// import logo from './logo.svg';
import './globalStyles/App.scss';
import Header from './components/header/Header';
import HeroSection from './components/firstPage/HeroSection/HeroSection';

function App() {
  return (
    <div className="App">
      <Header />
      <HeroSection/>
    </div>
  );
}

export default App;
