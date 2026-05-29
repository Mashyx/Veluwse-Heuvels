import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Plaat from './components/Plaat';
import Storyline from './pages/Storyline';
import InteractiveMap from './components/InteractiveMap';
function App() {
  const location = useLocation();
  
  // Controleer of we op de plaat-pagina zijn
  const isPlaatPage = location.pathname === '/plaat';

  return (
    <div className="app-container">
      {/* Alleen tonen als we NIET op de plaat-pagina zijn */}
      {!isPlaatPage && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plaat" element={<Plaat />} />
          <Route path="/:id" element={<Storyline />} />
          <Route path="/interactive-map" element={<InteractiveMap />} />
        </Routes>
      </main>

      {/* Alleen tonen als we NIET op de plaat-pagina zijn */}
      {!isPlaatPage && <Footer />}
    </div>
  );
}

export default App;