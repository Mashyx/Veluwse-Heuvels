import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div id="welcome-card" className="p-5 text-center">
      <h2>Welkom bij Veluwse Heuvels</h2>
      <p className="my-4">Ontdek de geschiedenis door interactieve schoolplaten te bekijken.</p>
      {/* Link direct naar het dashboard */}
      <Link to="/dashboard" id="startBtn" className="btn">
        Bekijk schoolplaten
      </Link>
    </div>
  );
}

export default Home;