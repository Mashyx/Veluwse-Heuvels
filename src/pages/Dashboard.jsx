import React from 'react';
import { useNavigate } from 'react-router-dom';
import { schoolplatenData } from '../data/schoolplaten';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const handleSelectPlaat = (plaat) => {
    if (plaat.available) {
      navigate(`/plaat/${plaat.id}`); 
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Kies een Schoolplaat</h2>
        <p>Duik in de geschiedenis van de Veluwe en ontdek de verhalen.</p>
      </header>

      <div className="platen-grid">
        {schoolplatenData.map((plaat) => (
          <div 
            key={plaat.id} 
            className={`plaat-card ${!plaat.available ? 'locked' : ''}`}
            onClick={() => handleSelectPlaat(plaat)}
          >
            <div className="card-image-wrapper">
              <img src={plaat.image} alt={plaat.title} />
              {!plaat.available && (
                <div className="locked-overlay">
                  <i className="bi bi-lock-fill"></i>
                  <span>Binnenkort</span>
                </div>
              )}
            </div>
            <div className="card-content">
              <h3>{plaat.title}</h3>
              {plaat.available ? (
                <button className="open-btn">Ontdekken <i className="bi bi-arrow-right"></i></button>
              ) : (
                <span className="coming-soon-text">In de maak...</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;