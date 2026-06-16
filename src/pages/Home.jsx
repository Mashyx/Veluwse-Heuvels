import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

function Home() {
  return (
    <div className="home-page-container">
      <div id="welcome-card" className="p-5 text-center shadow">
        <h2>Welkom bij Veluwse Heuvels</h2>
        <p className="my-4">Ontdek de geschiedenis door interactieve schoolplaten te bekijken.</p>
        <Link to="/dashboard" id="startBtn" className="btn">
          Bekijk schoolplaten
        </Link>
      </div>
    </div>
  );
}

export default Home;