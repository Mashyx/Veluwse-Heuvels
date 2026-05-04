import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Plaat.css';

function Plaat() {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  // We gebruiken refs om de staat van het slepen bij te houden zonder re-renders
  const state = useRef({
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1
  });

  const hotspots = [
    { id: 1, top: '47%', left: '41%', title: 'Stoomkuilen', info: 'Tijdens het ritueel tonen de vier stoomkuilen verschillende scènes: een actieve kuil met stoom die richting de grafheuvel waait; een moeder en haar zoontje bij het blussen van stenen; een jongen die een hete steen brengt om te helpen; en een meisje dat in stilte afscheid neemt met een barnstenen aandenken. Verder beheert een man het vuur bij een haard waar stenen en aardewerk worden verhit, terwijl een buurvrouw met een pot water wacht om te helpen blussen..', link: '/storyline3' },
    { id: 2, top: '15%', left: '52%', title: 'Dieren', info: ' Om te voorkomen dat de open heide tot een jong loofbos groeit liep er regelmatig vee rond. In dit geval heb ik ervoor gekozen om schapen in de verte af te beelden. Deze hebben weer een link met de herder (tweeling) op de middengrond, die even de tijd nam om bij het ritueel te zijn. Op het pad van heuvel 2 naar heuvel 1 lopen twee mensen. De vrouw heeft water meegenomen en de man naast haar heeft brandhout meegenomen voor het vuur. Tenslotte is de plek waar de plaggen net zijn afgestoken te zien achter de “wachter”, zodat er ook hier continuïteit in verhaallijn zit.', link: '/storyline1' },
    { id: 3, top: '32%', left: '78%', title: 'Het grafritueel', info: 'Tijdens een begrafenisritueel legt de weduwe verkoold hout in het graf, terwijl een belangrijke vrouw een toespraak houdt. Rondom de grafheuvel staan familie en kennissen: sommigen rouwen en troosten elkaar, anderen kijken nieuwsgierig toe of brengen giften. Ontdek wwaarom ze dit doen en wat er precies gebeurt.', link: '/storyline4' },
    { id: 4, top: '45%', left: '10%', title: 'Kleding', info: 'Hoe liep iemand er in de bronstijd eigenlijk bij? Ontdek gewaden, riemen en sieraden uit een lang vergane tijd en stel zelf een outfit samen als een echte stijlexpert uit de prehistorie!', link: '/storyline2' }
  ];

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
      // Alleen slepen als we niet op de popup, knoppen of iconen klikken
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

      // Check of er echt bewogen wordt
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
  }, []);

  const handleHotspotClick = (e, spot) => {
    e.stopPropagation();
    // Alleen popup openen als we NIET gesleept hebben
    if (!state.current.hasMoved) {
      setSelectedHotspot(spot);
    }
  };

  return (
    <div id="plaat-wrapper" ref={wrapperRef}>
      <Link to="/" className="back-to-home">← Terug</Link>

      <div 
        id="plaat-container" 
        ref={containerRef}
        onClick={() => { if(state.current.hasMoved) setSelectedHotspot(null); }}
      >
        <img id="plaat-img" src="/images/grafheuvels.jpg" alt="Plaat" draggable="false" />
        
        {hotspots.map((spot) => (
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