import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Plaat from './components/Plaat';
import Storyline from './pages/Storyline';
import Dashboard from './pages/Dashboard';

function App() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const isPlaatPage = location.pathname.startsWith('/plaat');

  useEffect(() => {
    if (location.pathname === '/') return;

    let timeoutId;
    const tweeMinuten = 2 * 60 * 1000; 

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        navigate('/'); 
      }, tweeMinuten);
    };

    const activiteiten = ['mousemove', 'mousedown', 'click', 'scroll', 'touchstart', 'keypress'];

    activiteiten.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activiteiten.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [location.pathname, navigate]);

  return (
    <div className="app-container">
      {!isPlaatPage && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plaat/:id" element={<Plaat />} />
          <Route path="/storyline/:id" element={<Storyline />} />       
        </Routes>
      </main>

      {!isPlaatPage && <Footer />}
    </div>
  );
}

export default App;