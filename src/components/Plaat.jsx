import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { platenData } from '../data/platenData';
import './Plaat.css'; 

function Plaat() {
  const { id } = useParams(); 
  const currentPlaat = platenData[id]; 
  
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  const state = useRef({
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1
  });

  if (!currentPlaat) {
    return (
      <div className="text-center py-5">
        <h2>Oeps! Deze schoolplaat bestaat niet.</h2>
        <Link to="/dashboard" className="btn btn-primary mt-3">Terug naar het overzicht</Link>
      </div>
    );
  }

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const constrain = () => {
      const rect = container.getBoundingClientRect();
      const minX = Math.min(0, wrapper.clientWidth - rect.width);
      const minY = Math.min(0, wrapper.clientHeight - rect.height);
      state.current.offsetX = Math.max(minX, Math.min(0, state.current.offsetX));
      state.current.offsetY = Math.max(minY, Math.min(0, state.current.offsetY));
    };

    const update = () => {
      container.style.transform = `translate3d(${state.current.offsetX}px, ${state.current.offsetY}px, 0) scale(${state.current.scale})`;
      const icons = container.querySelectorAll('.vergrootglas');
      icons.forEach(v => v.style.transform = `translate(-50%, -50%) scale(${1 / state.current.scale})`);
    };

    const onWheel = (e) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.002;
      const prevScale = state.current.scale;
      state.current.scale = Math.max(1, Math.min(4, state.current.scale + delta));
      
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      
      state.current.offsetX -= (cursorX) * (state.current.scale - prevScale) / state.current.scale;
      state.current.offsetY -= (cursorY) * (state.current.scale - prevScale) / state.current.scale;
      
      constrain();
      update();
    };

    const onMouseDown = (e) => {
      if (e.target.closest('.popup') || e.target.closest('.back-to-home') || e.target.closest('.vergrootglas')) return;
      state.current.isDragging = true;
      state.current.hasMoved = false;
      state.current.startX = e.clientX - state.current.offsetX;
      state.current.startY = e.clientY - state.current.offsetY;
      wrapper.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
      if (!state.current.isDragging) return;
      const x = e.clientX - state.current.startX;
      const y = e.clientY - state.current.startY;

      if (Math.abs(x - state.current.offsetX) > 5 || Math.abs(y - state.current.offsetY) > 5) {
        state.current.hasMoved = true;
      }

      state.current.offsetX = x;
      state.current.offsetY = y;
      constrain();
      update();
    };

    const onMouseUp = () => {
      state.current.isDragging = false;
      wrapper.style.cursor = 'grab';
      
      setTimeout(() => {
        state.current.hasMoved = false;
      }, 50);
    };

    wrapper.addEventListener('wheel', onWheel, { passive: false });
    wrapper.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      wrapper.removeEventListener('wheel', onWheel);
      wrapper.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [id]); 

  const handleHotspotClick = (e, spot) => {
    e.stopPropagation();
    if (!state.current.hasMoved) {
      setSelectedHotspot(spot);
    }
  };

  return (
    <div id="plaat-wrapper" ref={wrapperRef}>
      <Link to="/dashboard" className="back-to-home">← Overzicht</Link>

      <div 
        id="plaat-container" 
        ref={containerRef}
        onClick={() => { if(state.current.hasMoved) setSelectedHotspot(null); }}
      >
        <img id="plaat-img" src={currentPlaat.image} alt={currentPlaat.title} draggable="false" />
        
        {currentPlaat.hotspots.map((spot) => (
          <div 
            key={spot.id}
            className="vergrootglas" 
            style={{ top: spot.top, left: spot.left }}
            onMouseUp={(e) => handleHotspotClick(e, spot)}
          >
            <i className="bi bi-search"></i>
          </div>
        ))}
      </div>

      {/* Popup */}
      <div className={`popup ${selectedHotspot ? 'active' : ''}`}>
        <button id="popup-close" onClick={() => setSelectedHotspot(null)}>✖</button>
        <div id="popup-content">
          {selectedHotspot && (
            <>
              <strong>{selectedHotspot.title}</strong>
              <p>{selectedHotspot.info}</p>
              <button 
                id="popup-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(selectedHotspot.link);
                }}
              >
                Ga naar verhaal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Plaat;