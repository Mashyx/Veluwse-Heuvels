import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Plaat from './components/Plaat';
import Storyline from './pages/Storyline';
import Dashboard from './pages/Dashboard';

function App() {
  const location = useLocation();
  const isPlaatPage = location.pathname.startsWith('/plaat');

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